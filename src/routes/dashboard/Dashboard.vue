<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<template>
  <NavBarDash></NavBarDash>
  <div class="app-layout-container bg grey padd">
    <div>
      <va-button preset="primary" class="ml-2" @click="addPlainTextWidget"
        >Add widget</va-button
      >
    </div>
    <div class="main-section">
      <va-scroll-container
        class="max-h-[400px] dashboard-container"
        horizontal
        vertical
      >
        <div hidden>{{ layout }}</div>
        <smart-widget-grid :layout="layout" responsive>
          <!-- layout[$].i as slot name -->
          <template #0>
            <smart-widget title="Einwohner 2022" shadow="hover">
              <div class="layout-center">
                <h1>108.867</h1>
              </div>
            </smart-widget>
          </template>
          <template #3>
            <smart-widget title="Einwohner 2021" loading shadow="hover">
              <div class="layout-center">
                <h1>108.141</h1>
              </div>
            </smart-widget>
          </template>
          <template #1>
            <smart-widget title="Einwohner je Jahr">
              <Suspense>
                <ChartWidget chart-store="w1" :mdx="mdx"></ChartWidget>
              </Suspense>
            </smart-widget>
          </template>
          <template #2>
            <smart-widget title="Altersgruppen je Bezirk" fullscreen>
              <Suspense>
                <ChartWidget chart-store="w2" :mdx="mdx2"></ChartWidget>
              </Suspense>
            </smart-widget>
          </template>
          <template #4>
            <smart-widget title="Kinder pro Jahr" fullscreen>
              <Suspense>
                <ChartPolarWidget
                  chart-store="w3"
                  :mdx="mdx3"
                ></ChartPolarWidget>
              </Suspense>
            </smart-widget>
          </template>
          <template #5>
            <smart-widget title="Kinder pro Jahr" fullscreen>
              <Suspense>
                <ChartPolarWidget
                  chart-store="w3"
                  :mdx="mdx3"
                ></ChartPolarWidget>
              </Suspense>
            </smart-widget>
          </template>
          <template #6>
            <ButtonControl />
          </template>
          <template
            v-for="widget in customWidgets"
            :key="widget.id"
            v-slot:[widget.id]
          >
            <smart-widget :title="widget.caption" fullscreen>
              <template #toolbar>
                <va-button
                  icon="settings"
                  class="mt-2 mr-2"
                  color="secondary"
                  preset="secondary"
                  @click="openSettings(widget)"
                />
              </template>
              <div></div>
              <Suspense>
                <template #fallback>
                  <div>Loading...</div>
                </template>
                <component
                  :is="widget.component"
                  :storeId="widget.storeId"
                  :ref="widget.id"
                ></component>
              </Suspense>
            </smart-widget>
          </template>
        </smart-widget-grid>
      </va-scroll-container>
      <div>
        <div>
          <va-button>Add REST datasource</va-button>
          <DatasourceList class="mt-2" />
        </div>
        <div>
          <StoreList class="mt-2" />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <WidgetSelectionModal ref="widgetSelectionModal"></WidgetSelectionModal>
      <StoreSelectionModal ref="storeSelectionModal"></StoreSelectionModal>
      <StoreConfigurationModal
        ref="storeConfigurationModal"
      ></StoreConfigurationModal>
      <component v-if="modalIsOpened" :is="openedModal" ref="modal"></component>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import NavBarDash from "./NavBarDash.vue";
import ChartWidget from "@/components/Charts/ChartWidgetModule.vue";
import ChartPolarWidget from "@/components/Charts/ChartPolarWidgetModule.vue";
import {
  ref,
  markRaw,
  getCurrentInstance,
  onMounted,
  nextTick,
  type ComponentInternalInstance,
} from "vue";
import ButtonControl from "@/components/Controls/Button/ButtonControl.vue";
import { useDashboardStore } from "@/stores/DashboardStore";
import PlainTextWidget from "@/components/Widgets/PlainText/PlainTextWidget.vue";
import PlainTextWidgetSettings from "@/components/Widgets/PlainText/PlainTextWidgetSettings.vue";
import DatasourceList from "@/components/Datasources/DatasourceList.vue";
import StoreList from "@/components/Stores/StoreList.vue";
import WidgetSelectionModal from "@/components/Widgets/WidgetSelectionModal.vue";
import StoreSelectionModal from "@/components/Stores/StoreSelectionModal.vue";
import StoreConfigurationModal from "@/components/Stores/StoreConfigurationModal.vue";
import { useStoreManager } from "@/composables/storeManager";

const dashboardStore = useDashboardStore();
const storeManager = useStoreManager();

const layout = ref([
  { x: 0, y: 0, w: 2, h: 3, i: "0" },
  { x: 4, y: 0, w: 4, h: 6, i: "1" },
  { x: 8, y: 0, w: 4, h: 6, i: "2" },
  { x: 2, y: 0, w: 2, h: 3, i: "3" },
  { x: 0, y: 3, w: 2, h: 6, i: "4" },
  { x: 0, y: 5, w: 1, h: 1, i: "6", isResizable: false },
]);
const mdx = ref(`SELECT
Hierarchize(AddCalculatedMembers({[Geschlecht.Geschlecht (m/w/d)].[(All)].members})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME ON 1,
Hierarchize(AddCalculatedMembers({[Jahr].[Jahr].members})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME ON 0
FROM [Bevölkerung] CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS`);

const mdx2 = ref(`SELECT

        Hierarchize(
            DrilldownLevel({[Alter.Altersgruppen (10-Jahres-Gruppen)].[(All)]},,,INCLUDE_CALC_MEMBERS)
        ) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME ON 1,


        Hierarchize(
          AddCalculatedMembers
          (

            DrilldownMember({{
              DrilldownLevel({[statistischer Bezirk.Stadt - Planungsraum - statistischer Bezirk].[(All)]},,,INCLUDE_CALC_MEMBERS)
            }}, {[statistischer Bezirk.Stadt - Planungsraum - statistischer Bezirk].[Jena]})

          )
        ) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME,[statistischer Bezirk.Stadt - Planungsraum - statistischer Bezirk].[Stadt].[GeoJson],[statistischer Bezirk.Stadt - Planungsraum - statistischer Bezirk].[Planungsraum].[uuid],[statistischer Bezirk.Stadt - Planungsraum - statistischer Bezirk].[Planungsraum].[GeoJson],[statistischer Bezirk.Stadt - Planungsraum - statistischer Bezirk].[Statistischer Bezirk].[uuid],[statistischer Bezirk.Stadt - Planungsraum - statistischer Bezirk].[Statistischer Bezirk].[GeoJson] ON 0
FROM [Bevölkerung] CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS`);

const mdx3 = ref(`
SELECT
Hierarchize(AddCalculatedMembers({[Alter.Altersgruppen (Kinder)].[(All)].members})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME ON 1,

Hierarchize(AddCalculatedMembers({[Jahr].[Jahr].members})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME ON 0
FROM [Bevölkerung] CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS`);

const customWidgets = ref([] as any[]);
const widgetSelectionModal = ref(null);
const storeSelectionModal = ref(null);
const storeConfigurationModal = ref(null);

const addPlainTextWidget = async () => {
  const widget = await (widgetSelectionModal.value as any).run();
  const { storeId, type } = await (storeSelectionModal.value as any).run();
  await nextTick();
  if (type === "new") {
    const store = storeManager.getStore(storeId);
    console.log(store, storeId);
    const dashboardsIds = await (storeConfigurationModal.value as any).run();
    dashboardsIds.forEach(element => {
      store?.addDatasource(element.id);
    });
    console.log(dashboardsIds);
  }

  const id = `text ${Date.now()}`;
  layout.value.push({
    x: 0,
    y: 0,
    w: 3,
    h: 3,
    i: id,
  });

  customWidgets.value.push({
    id: id,
    component: widget.Component,
    storeId,
    caption: widget.Caption,
  });

  console.log(customWidgets.value);
};

const modalIsOpened = ref(false);
const openedModal = ref(null as any);
const modal = ref(null);

let refs;
onMounted(() => {
  refs = getCurrentInstance();
});

const openSettings = async (widget) => {
  if (widget.component.__name === "PlainTextWidget") {
    modalIsOpened.value = true;
    openedModal.value = markRaw(PlainTextWidgetSettings);
    await nextTick();
    console.log("open modal");
    // const data = refs.ctx.$refs[widget.id].getValue();
    const { field, url } = await (modal.value as any).run(widget.storeId);
    console.log(refs.ctx.$refs);
    refs.ctx.$refs[widget.id].setSettings({ field, url });
  }
};
</script>

<style>
.vue-grid-item {
  transition: all 0.2s ease;
  transition-property: left, top, right;
}
.vue-grid-item.no-touch {
  -ms-touch-action: none;
  touch-action: none;
}
.vue-grid-item.cssTransforms {
  transition-property: transform;
  left: 0;
  right: auto;
}
.vue-grid-item.cssTransforms.render-rtl {
  left: auto;
  right: 0;
}
.vue-grid-item.resizing {
  opacity: 0.6;
  z-index: 3;
}
.vue-grid-item.vue-draggable-dragging {
  transition: none;
  z-index: 3;
}
.vue-grid-item.vue-grid-placeholder {
  background: red;
  opacity: 0.2;
  transition-duration: 0.1s;
  z-index: 2;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.vue-grid-item > .vue-resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=);
  background-position: bottom right;
  padding: 0 3px 3px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: se-resize;
}
.vue-grid-item > .vue-rtl-resizable-handle {
  bottom: 0;
  left: 0;
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAuMDAwMDAwMDAwMDAwMDAyIiBoZWlnaHQ9IjEwLjAwMDAwMDAwMDAwMDAwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIxMiIgd2lkdGg9IjEyIiB5PSItMSIgeD0iLTEiLz4KICA8ZyBkaXNwbGF5PSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgeT0iMCIgeD0iMCIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgaWQ9ImNhbnZhc0dyaWQiPgogICA8cmVjdCBmaWxsPSJ1cmwoI2dyaWRwYXR0ZXJuKSIgc3Ryb2tlLXdpZHRoPSIwIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxsaW5lIGNhbnZhcz0iI2ZmZmZmZiIgY2FudmFzLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzEiIHkyPSItNzAuMTc4NDA3IiB4Mj0iMTI0LjQ2NDE3NSIgeTE9Ii0zOC4zOTI3MzciIHgxPSIxNDQuODIxMjg5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIi8+CiAgPGxpbmUgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z181IiB5Mj0iOS4xMDY5NTciIHgyPSIwLjk0NzI0NyIgeTE9Ii0wLjAxODEyOCIgeDE9IjAuOTQ3MjQ3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8bGluZSBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z183IiB5Mj0iOSIgeDI9IjEwLjA3MzUyOSIgeTE9IjkiIHgxPSItMC42NTU2NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiM2NjY2NjYiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+);
  background-position: bottom left;
  padding-left: 3px;
  background-repeat: no-repeat;
  background-origin: content-box;
  cursor: sw-resize;
  right: auto;
}
.vue-grid-item.disable-userselect {
  user-select: none;
}
.vue-grid-layout {
  position: relative;
  transition: height 0.2s ease;
}
.vue-grid-layout {
  background: transparent;
}
.vue-grid-layout .smartwidget {
  height: inherit;
  width: inherit;
}
.vue-grid-layout .smartwidget.smartwidget-fullscreen {
  height: 100%;
  width: 100%;
}
.smart-widget__loading-mask {
  position: absolute;
  z-index: 2000;
  background-color: #ffffffe6;
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
.smart-widget__loading-mask .loading-spinner {
  top: 50%;
  margin-top: -21px;
  width: 100%;
  text-align: center;
  position: absolute;
}
.smart-widget__loading-mask .circular {
  width: 42px;
  height: 42px;
  animation: loading-rotate 2s linear infinite;
}
.smart-widget__loading-mask .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: #5282e4;
  stroke-linecap: round;
}
@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  to {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
.collapse-transition[data-v-5f8fde58] {
  transition:
    0.3s height ease-in-out,
    0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
}
.vue-grid-item {
  touch-action: none;
  box-sizing: border-box;
}
.vue-grid-item.vue-grid-placeholder {
  background: #7cbeff;
  opacity: 0.2;
  transition-duration: 0.1s;
  z-index: 2;
  user-select: none;
}
body.no-overflow[data-v-059e0ffc] {
  overflow: hidden;
  position: fixed;
  width: 100%;
}
.smartwidget[data-v-059e0ffc] {
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 1px 2px #0000000d;
  border: 1px solid #ebeef5;
  width: 100%;
  transition: 0.3s;
}
.smartwidget.is-always-shadow[data-v-059e0ffc] {
  box-shadow: 0 0 10px #e9e9e9;
}
.smartwidget.is-hover-shadow[data-v-059e0ffc]:hover {
  box-shadow: 0 0 10px #e9e9e9;
}
.smartwidget.is-never-shadow[data-v-059e0ffc] {
  box-shadow: 0 1px 2px #0000000d;
}
.smartwidget .widget-header[data-v-059e0ffc] {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}
.smartwidget .widget-header .widget-header__title[data-v-059e0ffc] {
  display: inline-block;
  position: relative;
  width: auto;
  margin: 0;
  font-weight: normal;
  letter-spacing: 0;
  align-items: center;
  font-size: 16px;
}
.smartwidget .widget-header .widget-header__subtitle[data-v-059e0ffc] {
  font-size: 12px;
  color: #777;
  margin-left: 10px;
}
.smartwidget .widget-header .ellis[data-v-059e0ffc] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.smartwidget .widget-header .widget-header__prefix[data-v-059e0ffc] {
  background: #0076db;
  width: 2px;
  height: 16px;
  margin-left: 10px;
}
.smartwidget .widget-header .widget-header__toolbar[data-v-059e0ffc] {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  padding: 0;
  margin: 0;
}
.smartwidget .widget-header .widget-header__toolbar a[data-v-059e0ffc] {
  display: inline-block;
  text-decoration: none;
  text-align: center;
  height: 24px;
  line-height: 28px;
  padding: 0;
  margin: 0;
  color: #333;
  min-width: 35px;
  position: relative;
  font-family: Arial, Helvetica, sans-serif;
  border-left: 1px solid rgba(0, 0, 0, 0.09);
}
.smartwidget .widget-body-simple[data-v-059e0ffc] {
  display: flex;
  height: inherit;
  width: inherit;
}
.smartwidget .widget-body-simple .widget-body__content[data-v-059e0ffc] {
  width: 100%;
}
.smartwidget .widget-body[data-v-059e0ffc] {
  display: flex;
  flex-direction: column;
  will-change: height;
  position: relative;
  overflow: hidden;
}
.smartwidget .widget-body .widget-body__content[data-v-059e0ffc] {
  flex: 1;
}
.smartwidget .widget-body .widget-body__content.fixed-height[data-v-059e0ffc] {
  overflow-y: scroll;
}
.smartwidget .widget-body .widget-body__footer[data-v-059e0ffc] {
  position: relative;
}
.smartwidget .widget-body .widget-body__footer.has-group[data-v-059e0ffc] {
  left: 0;
  bottom: 0;
  width: 100%;
}
.smartwidget .widget-body.is-collapse[data-v-059e0ffc] {
  transition:
    0.3s height ease-in-out,
    0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
}
.smartwidget.smartwidget-fullscreen[data-v-059e0ffc] {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 6666;
}
.smartwidget.smartwidget-fullscreen .widget-header[data-v-059e0ffc] {
  cursor: default;
}
.smartwidget svg.sw-loading[data-v-059e0ffc] {
  animation: rotating 2s linear infinite;
  cursor: not-allowed;
}
</style>
<style scoped lang="scss">
.padd {
  padding: 15px;
}
.app-layout-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 65px;
}

.main-section {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  gap: 1rem;
}

.dashboard-container {
  flex-grow: 1;
  width: 100%;
  min-height: 100%;
}

.layout-center {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  height: 100%;

  h1 {
    font-size: 45px;
    font-weight: 300;
  }
}
</style>
