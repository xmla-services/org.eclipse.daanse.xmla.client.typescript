<template>
  <NavBarDash></NavBarDash>
  <div class="app-container">
    <div
      class="app-layout-container bg grey padd"
      :class="{ editDisabled: !editEnabled }"
    >
      <div class="widgets-select">
        <va-select 
          v-model="selectedAction"
          :options="widgetOptions"
          label="widgets"
        />
        <va-button 
          class="add-widget-btn"
          @click="addSelectedWidget"
        >
          Add Widget
        </va-button>
      </div>
      <div class="buttons-list">
        <va-button preset="primary" class="ml-2" @click="toggleEdit">
          Toggle edit
        </va-button>
        <va-button preset="primary" class="ml-2" @click="saveLayout">
          Save layout
        </va-button>
        <va-button preset="primary" class="ml-2" @click="loadLayout">
          Load layout
        </va-button>
        <va-button preset="primary" class="ml-2" @click="openStoreList">
          Open Store List
        </va-button>
        <va-button preset="primary" class="ml-2" @click="loadDemo">
          Load demo
        </va-button>
        <va-button preset="primary" class="ml-2" @click="addPivotTable">
          Add pivot table
        </va-button>
        <va-button preset="primary" class="ml-2" @click="openAppSettings">
          Open App settings
        </va-button>
      </div>
      <div class="main-section">
        <!-- <div class="dashboard-container">
          <div
            class="d_1 dashboard-item-container"
            :style="getInitialStyle('d_1')"
            ref="d_1"
          >
            <va-dropdown
              :trigger="editEnabled ? 'right-click' : 'none'"
              :auto-placement="false"
              placement="right-start"
              cursor
            >
              <template #anchor>
                <div class="dashboard-item">
                  <smart-widget
                    title="Einwohner 2022"
                    shadow="hover"
                    class="widget-content"
                  >
                    <div class="layout-center">
                      <h1>108.867</h1>
                    </div>
                  </smart-widget>
                </div>
              </template>

              <va-dropdown-content>
                <div class="dropdown-buttons-container">
                  <va-button @click="moveUp('d_1')">Move up</va-button>
                  <va-button @click="moveDown('d_1')">Move down</va-button>
                  <va-button @click="moveToTop('d_1')">Move to top</va-button>
                  <va-button @click="moveToBottom('d_1')">
                    Move to bottom
                  </va-button>
                </div>
              </va-dropdown-content>
            </va-dropdown>
          </div>
          <Moveable
            v-bind:target="['.d_1']"
            v-bind:draggable="editEnabled"
            v-bind:resizable="editEnabled"
            v-bind:useResizeObserver="true"
            v-bind:useMutationObserver="true"
            @drag="drag('d_1', $event)"
            @resize="resize('d_1', $event)"
            ref="d_1_control"
            :snappable="false"
            :snapGridWidth="20"
            :snapGridHeight="20"
            :style="getMovableControlStyles('d_1')"
          >
          </Moveable>

          <div
            class="d_2 dashboard-item-container"
            :style="getInitialStyle('d_2')"
            ref="d_2"
          >
            <va-dropdown
              :trigger="editEnabled ? 'right-click' : 'none'"
              :auto-placement="false"
              placement="right-start"
              cursor
            >
              <template #anchor>
                <div class="dashboard-item">
                  <smart-widget
                    title="Einwohner 2021"
                    loading
                    shadow="hover"
                    class="widget-content"
                  >
                    <div class="layout-center">
                      <h1>108.141</h1>
                    </div>
                  </smart-widget>
                </div>
              </template>

              <va-dropdown-content>
                <div class="dropdown-buttons-container">
                  <va-button @click="moveUp('d_2')">Move up</va-button>
                  <va-button @click="moveDown('d_2')">Move down</va-button>
                  <va-button @click="moveToTop('d_2')">Move to top</va-button>
                  <va-button @click="moveToBottom('d_2')">
                    Move to bottom
                  </va-button>
                </div>
              </va-dropdown-content>
            </va-dropdown>
          </div>
          <Moveable
            v-bind:target="['.d_2']"
            v-bind:draggable="editEnabled"
            v-bind:resizable="editEnabled"
            v-bind:useResizeObserver="true"
            v-bind:useMutationObserver="true"
            @resize="resize('d_2', $event)"
            @drag="drag('d_2', $event)"
            :snappable="true"
            :snapGridWidth="20"
            :snapGridHeight="20"
            ref="d_2_control"
            :style="getMovableControlStyles('d_2')"
          >
          </Moveable>

          <div
            class="d_3 dashboard-item-container"
            :style="getInitialStyle('d_3')"
            ref="d_3"
          >
            <va-dropdown
              :trigger="editEnabled ? 'right-click' : 'none'"
              :auto-placement="false"
              placement="right-start"
              cursor
            >
              <template #anchor>
                <div class="dashboard-item">
                  <DashboardControls
                    @openSettings="openSettings('test')"
                    v-if="editEnabled"
                  />
                  <ButtonControl class="widget-content" ref="test" />
                </div>
              </template>

              <va-dropdown-content>
                <div class="dropdown-buttons-container">
                  <va-button @click="moveUp('d_3')">Move up</va-button>
                  <va-button @click="moveDown('d_3')">Move down</va-button>
                  <va-button @click="moveToTop('d_3')">Move to top</va-button>
                  <va-button @click="moveToBottom('d_3')">
                    Move to bottom
                  </va-button>
                </div>
              </va-dropdown-content>
            </va-dropdown>
          </div>
          <Moveable
            v-bind:target="['.d_3']"
            v-bind:draggable="editEnabled"
            v-bind:resizable="editEnabled"
            v-bind:useResizeObserver="true"
            v-bind:useMutationObserver="true"
            @drag="drag('d_3', $event)"
            @resize="resize('d_3', $event)"
            :snappable="true"
            :snapGridWidth="20"
            :snapGridHeight="20"
            ref="d_3_control"
            :style="getMovableControlStyles('d_3')"
          >
          </Moveable>

          <div
            class="d_4 dashboard-item-container"
            :style="getInitialStyle('d_4')"
            ref="d_4"
          >
            <va-dropdown
              :trigger="editEnabled ? 'right-click' : 'none'"
              :auto-placement="false"
              placement="right-start"
              cursor
            >
              <template #anchor>
                <div class="dashboard-item">
                  <smart-widget
                    title="Einwohner je Jahr"
                    class="widget-content"
                  >
                    <Suspense>
                      <ChartWidget chart-store="w1" :mdx="mdx"></ChartWidget>
                    </Suspense>
                  </smart-widget>
                </div>
              </template>

              <va-dropdown-content>
                <div class="dropdown-buttons-container">
                  <va-button @click="moveUp('d_4')">Move up</va-button>
                  <va-button @click="moveDown('d_4')">Move down</va-button>
                  <va-button @click="moveToTop('d_4')">Move to top</va-button>
                  <va-button @click="moveToBottom('d_4')">
                    Move to bottom
                  </va-button>
                </div>
              </va-dropdown-content>
            </va-dropdown>
          </div>
          <Moveable
            v-bind:target="['.d_4']"
            v-bind:draggable="editEnabled"
            v-bind:resizable="editEnabled"
            v-bind:useResizeObserver="true"
            v-bind:useMutationObserver="true"
            @drag="drag('d_4', $event)"
            @resize="resize('d_4', $event)"
            ref="d_4_control"
            :snappable="true"
            :snapGridWidth="20"
            :snapGridHeight="20"
            :style="getMovableControlStyles('d_4')"
          >
          </Moveable>

          <div
            class="d_5 dashboard-item-container"
            :style="getInitialStyle('d_5')"
            ref="d_5"
          >
            <va-dropdown
              :trigger="editEnabled ? 'right-click' : 'none'"
              :auto-placement="false"
              placement="right-start"
              cursor
            >
              <template #anchor>
                <div class="dashboard-item">
                  <smart-widget
                    title="Altersgruppen je Bezirk"
                    fullscreen
                    class="widget-content"
                  >
                    <Suspense>
                      <ChartWidget chart-store="w2" :mdx="mdx2"></ChartWidget>
                    </Suspense>
                  </smart-widget>
                </div>
              </template>

              <va-dropdown-content>
                <div class="dropdown-buttons-container">
                  <va-button @click="moveUp('d_5')">Move up</va-button>
                  <va-button @click="moveDown('d_5')">Move down</va-button>
                  <va-button @click="moveToTop('d_5')">Move to top</va-button>
                  <va-button @click="moveToBottom('d_5')">
                    Move to bottom
                  </va-button>
                </div>
              </va-dropdown-content>
            </va-dropdown>
          </div>
          <Moveable
            v-bind:target="['.d_5']"
            v-bind:draggable="editEnabled"
            v-bind:resizable="editEnabled"
            v-bind:useResizeObserver="true"
            v-bind:useMutationObserver="true"
            @drag="drag('d_5', $event)"
            @resize="resize('d_5', $event)"
            :snappable="true"
            :snapGridWidth="20"
            :snapGridHeight="20"
            ref="d_5_control"
            :style="getMovableControlStyles('d_5')"
          >
          </Moveable>

          <div
            class="d_6 dashboard-item-container"
            :style="getInitialStyle('d_6')"
            ref="d_6"
          >
            <va-dropdown
              :trigger="editEnabled ? 'right-click' : 'none'"
              :auto-placement="false"
              placement="right-start"
              cursor
            >
              <template #anchor>
                <div class="dashboard-item">
                  <smart-widget
                    title="Kinder pro Jahr"
                    fullscreen
                    class="widget-content"
                  >
                    <Suspense>
                      <ChartPolarWidget
                        chart-store="w3"
                        :mdx="mdx3"
                      ></ChartPolarWidget>
                    </Suspense>
                  </smart-widget>
                </div>
              </template>

              <va-dropdown-content>
                <div class="dropdown-buttons-container">
                  <va-button @click="moveUp('d_6')">Move up</va-button>
                  <va-button @click="moveDown('d_6')">Move down</va-button>
                  <va-button @click="moveToTop('d_6')">Move to top</va-button>
                  <va-button @click="moveToBottom('d_6')">
                    Move to bottom
                  </va-button>
                </div>
              </va-dropdown-content>
            </va-dropdown>
          </div>
          <Moveable
            v-bind:target="['.d_6']"
            v-bind:draggable="editEnabled"
            v-bind:resizable="editEnabled"
            v-bind:useResizeObserver="true"
            v-bind:useMutationObserver="true"
            @drag="drag('d_6', $event)"
            @resize="resize('d_6', $event)"
            :snappable="true"
            :snapGridWidth="20"
            :snapGridHeight="20"
            ref="d_6_control"
            :style="getMovableControlStyles('d_6')"
          >
          </Moveable>
        </div> -->
        <template v-for="widget in customWidgets" :key="widget.id">
          <div
            :class="`${widget.id} dashboard-item-container`"
            :style="getInitialStyle(widget.id)"
            :ref="widget.id"
          >
            <va-dropdown
              :trigger="editEnabled ? 'right-click' : 'none'"
              :auto-placement="false"
              placement="right-start"
              cursor
            >
              <template #anchor>
                <div class="dashboard-item">
                  <!-- <smart-widget
                    title="Kinder pro Jahr"
                    fullscreen
                    class="widget-content"
                  > -->
                  <Suspense>
                    <template #fallback>
                      <div>Loading...</div>
                    </template>
                    <!-- :storeId="widget.storeId" -->
                    <WidgetWrapper :ref="`${widget.id}_wrapper`">
                      <component
                        :is="enabledWidgets[widget.component]"
                        :ref="`${widget.id}_component`"
                        :initialState="widget.state"
                      ></component>
                    </WidgetWrapper>
                  </Suspense>
                  <!-- </smart-widget> -->
                  <DashboardControls
                    v-if="editEnabled"
                    @openSettings="
                      openSettings(
                        `${widget.id}_component`,
                        `${widget.id}_wrapper`,
                        'Widget',
                      )
                    "
                    @deleteWidget="
                      deleteWidget(widget.id)
                    "
                  />
                </div>
              </template>

              <va-dropdown-content>
                <div class="dropdown-buttons-container">
                  <va-button @click="moveUp(widget.id)">Move up</va-button>
                  <va-button @click="moveDown(widget.id)">Move down</va-button>
                  <va-button @click="moveToTop(widget.id)"
                    >Move to top</va-button
                  >
                  <va-button @click="moveToBottom(widget.id)">
                    Move to bottom
                  </va-button>
                </div>
              </va-dropdown-content>
            </va-dropdown>
          </div>
          <Moveable
            v-bind:target="[`.${widget.id}`]"
            v-bind:draggable="editEnabled"
            v-bind:resizable="editEnabled"
            v-bind:useResizeObserver="true"
            v-bind:useMutationObserver="true"
            @drag="drag(widget.id, $event)"
            @resize="resize(widget.id, $event)"
            :snappable="true"
            :snapGridWidth="20"
            :snapGridHeight="20"
            :ref="`${widget.id}_control`"
            :style="getMovableControlStyles(widget.id)"
          >
          </Moveable>
        </template>

        <div
          class="d_3 dashboard-item-container"
          :style="getInitialStyle('d_3')"
          ref="d_3"
        >
          <va-dropdown
            :trigger="editEnabled ? 'right-click' : 'none'"
            :auto-placement="false"
            placement="right-start"
            cursor
          >
            <template #anchor>
              <div class="dashboard-item">
                <DashboardControls
                  @openSettings="openSettings('test', null)"
                  v-if="editEnabled"
                />
                <ButtonControl class="widget-content" ref="test" />
              </div>
            </template>

            <va-dropdown-content>
              <div class="dropdown-buttons-container">
                <va-button @click="moveUp('d_3')">Move up</va-button>
                <va-button @click="moveDown('d_3')">Move down</va-button>
                <va-button @click="moveToTop('d_3')">Move to top</va-button>
                <va-button @click="moveToBottom('d_3')">
                  Move to bottom
                </va-button>
              </div>
            </va-dropdown-content>
          </va-dropdown>
        </div>
        <Moveable
          v-bind:target="['.d_3']"
          v-bind:draggable="editEnabled"
          v-bind:resizable="editEnabled"
          v-bind:useResizeObserver="true"
          v-bind:useMutationObserver="true"
          @drag="drag('d_3', $event)"
          @resize="resize('d_3', $event)"
          :snappable="true"
          :snapGridWidth="20"
          :snapGridHeight="20"
          ref="d_3_control"
          :style="getMovableControlStyles('d_3')"
        >
        </Moveable>

        <!-- <div
          class="d_7 dashboard-item-container"
          :style="getInitialStyle('d_7')"
          ref="d_7"
        >
          <va-dropdown
            :trigger="editEnabled ? 'right-click' : 'none'"
            :auto-placement="false"
            placement="right-start"
            cursor
          >
            <template #anchor>
              <div class="dashboard-item">
                <DashboardControls
                  @openSettings="openSettings('test1')"
                  v-if="editEnabled"
                />
                <InputControl class="widget-content" ref="test1" />
              </div>
            </template>

            <va-dropdown-content>
              <div class="dropdown-buttons-container">
                <va-button @click="moveUp('d_7')">Move up</va-button>
                <va-button @click="moveDown('d_7')">Move down</va-button>
                <va-button @click="moveToTop('d_7')">Move to top</va-button>
                <va-button @click="moveToBottom('d_7')">
                  Move to bottom
                </va-button>
              </div>
            </va-dropdown-content>
          </va-dropdown>
        </div>
        <Moveable
          v-bind:target="['.d_7']"
          v-bind:draggable="editEnabled"
          v-bind:resizable="editEnabled"
          v-bind:useResizeObserver="true"
          v-bind:useMutationObserver="true"
          @drag="drag('d_7', $event)"
          @resize="resize('d_7', $event)"
          :snappable="true"
          :snapGridWidth="20"
          :snapGridHeight="20"
          ref="d_7_control"
          :style="getMovableControlStyles('d_7')"
        >
        </Moveable> -->
      </div>
    </div>
    <SidebarSettings
      v-model="showSidebar"
      :settingsSection="settingsSection"
      @updateBackgroundColor="updateBackgroundColor"
      class="sidebar"
    ></SidebarSettings>
  </div>
</template>

<script setup lang="ts">
import NavBarDash from "./NavBarDash.vue";
import ChartWidget from "@/components/Charts/ChartWidgetModule.vue";
import ChartPolarWidget from "@/components/Charts/ChartPolarWidgetModule.vue";
import DashboardControls from "@/components/Dashboard/DashboardControls.vue";
import {
  ref,
  markRaw,
  getCurrentInstance,
  onMounted,
  inject,
  nextTick,
} from "vue";
import ButtonControl from "@/components/Controls/Button/ButtonControl.vue";
import InputControl from "@/components/Controls/Input/InputControl.vue";
import PlainTextWidget from "@/components/Widgets/PlainText/PlainTextWidget.vue";
import PivotTableWidget from "@/components/Widgets/PivotTable/PivotTableWidget.vue";
import ImageWidget from "@/components/Widgets/Image/ImageWidget.vue";
import TextWidget from "@/components/Widgets/Text/TextWidget.vue";
import ListWidget from "@/components/Widgets/List/ListWidget.vue";
import SvgWidget from "@/components/Widgets/Svg/SvgWidget.vue";
import RepeatableSvgWidget from "@/components/Widgets/RepeatableSvg/RepeatableSvgWidget.vue";
import ProgressWidget from "@/components/Widgets/Progress/ProgressWidget.vue";
import VideoWidget from "@/components/Widgets/Video/VideoWidget.vue";
import IconWidget from "@/components/Widgets/Icon/IconWidget.vue";
import RichTextWidget from "@/components/Widgets/RichText/RichTextWidget.vue";
import { useStoreManager } from "@/composables/storeManager";
import Moveable from "vue3-moveable";
import SidebarSettings from "@/components/Sidebar/SidebarSettings.vue";
import { useDatasourceManager } from "@/composables/datasourceManager";
import WidgetWrapper from "@/components/Widgets/WidgetWrapper/WidgetWrapper.vue";

const storeManager = useStoreManager();
const dsManager = useDatasourceManager();

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
const editEnabled = ref(false);
const timestamp = ref(Date.now());
const showSidebar = ref(false);
const settingsSection = ref(null as any);
const test = ref(null);
const test1 = ref(null);
const settingsBackground = ref('#fefefe');
const EventBus = inject("customEventBus") as any;
const selectedAction = ref('');

const enabledWidgets = {
  ImageWidget,
  TextWidget,
  PlainTextWidget,
  PivotTableWidget,
  SvgWidget,
  RepeatableSvgWidget,
  ProgressWidget,
  VideoWidget,
  IconWidget,
  RichTextWidget,
};

const widgetOptions = [
  'Plain Text Widget' ,
  'Plain List Widget' ,
  'Image Widget',
  'Text Widget',
  'Svg Widget',
  'Repeatable Svg Widget',
  'Progress Widget',
  'Video Widget',
  'Icon Widget',
  'Rich Text Widget',
];

const addSelectedWidget = () => {
  switch (selectedAction.value) {
    case 'Plain Text Widget':
      addPlainTextWidget();
      break;
    case 'Plain List Widget':
      addPlainListWidget();
      break;
    case 'Image Widget':
      addImageWidget();
      break;
    case 'Text Widget':
      addTextWidget();
      break;
    case 'Svg Widget':
      addSvgWidget();
      break;
    case 'Repeatable Svg Widget':
      addRepeatableSvgWidget();
      break;
    case 'Progress Widget':
      addProgressWidget();
      break;
    case 'Video Widget':
      addVideoWidget();
      break;
    case 'Icon Widget':
      addIconWidget();
      break;
    case 'Rich Text Widget':
      addRichTextWidget();
      break;
    default:
      break;
  }
};

let layout = {
  d_1: {
    x: 0,
    y: 0,
    width: 400,
    height: 400,
    z: 3001,
  },
  d_2: {
    x: 410,
    y: 0,
    width: 400,
    height: 400,
    z: 3000,
  },
  d_3: {
    x: 0,
    y: 430,
    width: 100,
    height: 40,
    z: 3000,
  },
  d_4: {
    x: 410,
    y: 410,
    width: 400,
    height: 400,
    z: 3000,
  },
  d_5: {
    x: 820,
    y: 0,
    width: 400,
    height: 400,
    z: 3000,
  },
  d_6: {
    x: 820,
    y: 410,
    width: 400,
    height: 400,
    z: 3002,
  },
  d_7: {
    x: 1230,
    y: 410,
    width: 200,
    height: 50,
    z: 3000,
  },
};

const addPlainTextWidget = async () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 300,
    height: 150,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "PlainTextWidget",
    // storeId: store.id,
    caption: "Test",
  });
};

const addPlainListWidget = async () => {
  const stores = Array.from(
    storeManager.getStoreList().value,
    function (entry) {
      return entry[1];
    },
  );
  const store = stores[0];
  console.log(store.id);
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 900,
    width: 300,
    height: 150,
    z: 3005,
  };

  customWidgets.value.push(
    markRaw({
      id: id,
      component: ListWidget,
      storeId: store.id,
      caption: "Test",
    }),
  );

  console.log(customWidgets.value);
};

let refs;
onMounted(() => {
  refs = getCurrentInstance();
});

const getInitialStyle = (id) => {
  timestamp.value;

  return {
    width: `${layout[id].width}px`,
    height: `${layout[id].height}px`,
    transform: `translate(${layout[id].x}px, ${layout[id].y}px)`,
    "z-index": layout[id].z,
  };
};

const getMovableControlStyles = (id) => {
  timestamp.value;
  return {
    "z-index": layout[id].z,
  };
};

const drag = (id, e) => {
  console.log("drag", e.transform);

  layout[id].x = e.translate[0];
  layout[id].y = e.translate[1];

  e.target.style.transform = e.transform;
  console.log(e.transform);
};

const resize = (id, e) => {
  e.target.style.width = `${e.width}px`;
  e.target.style.height = `${e.height}px`;

  layout[id].width = e.width;
  layout[id].height = e.height;
  layout[id].x = e.drag.translate[0];
  layout[id].y = e.drag.translate[1];
  e.target.style.transform = e.drag.transform;
};

const moveUp = (id) => {
  layout[id].z = layout[id].z + 1;

  const refArr = refs.ctx.$refs[id];
  const ref = Array.isArray(refArr) ? refArr[0] : refArr;

  ref.style["z-index"] = layout[id].z;
  refs.ctx.$refs[`${id}_control`].$el.style["z-index"] = layout[id].z;
};

const moveDown = (id) => {
  layout[id].z = layout[id].z - 1;

  const refArr = refs.ctx.$refs[id];
  const ref = Array.isArray(refArr) ? refArr[0] : refArr;

  ref.style["z-index"] = layout[id].z;
  refs.ctx.$refs[`${id}_control`].$el.style["z-index"] = layout[id].z;
};

const moveToBottom = (id) => {
  const obj = Object.entries(layout);
  const res = obj.reduce(function (p, v) {
    return p[1].z < v[1].z ? p : v;
  }, obj[0]);

  if (id !== res[0]) {
    layout[id].z = res[1].z - 1;

    const refArr = refs.ctx.$refs[id];
    const ref = Array.isArray(refArr) ? refArr[0] : refArr;

    ref.style["z-index"] = layout[id].z;
    refs.ctx.$refs[`${id}_control`][0].$el.style["z-index"] = layout[id].z;
  }
};

const moveToTop = (id) => {
  const obj = Object.entries(layout);
  const res = obj.reduce(function (p, v) {
    return p[1].z > v[1].z ? p : v;
  }, obj[0]);

  if (id !== res[0]) {
    layout[id].z = res[1].z + 1;

    const refArr = refs.ctx.$refs[id];
    const ref = Array.isArray(refArr) ? refArr[0] : refArr;

    ref.style["z-index"] = layout[id].z;
    refs.ctx.$refs[`${id}_control`].$el.style["z-index"] = layout[id].z;
  }
};

const toggleEdit = () => {
  editEnabled.value = !editEnabled.value;
  manuallyUpdateLayout();
};

const manuallyUpdateLayout = () => {
  timestamp.value = Date.now();
};

const saveLayout = () => {
  localStorage.setItem("testLayout", JSON.stringify(layout));

  const storeState = storeManager.getSerializedState();
  const dsState = dsManager.getSerializedState();

  const widgetsState = {};
  customWidgets.value.forEach((e) => {
    const refArr = refs.ctx.$refs[`${e.id}_component`];
    const ref = Array.isArray(refArr) ? refArr[0] : refArr;

    const state = ref.getState();
    widgetsState[e.id] = {
      component: e.component,
      caption: e.caption,
      state,
    };
  });

  localStorage.setItem("dsState", dsState);
  localStorage.setItem("storeState", storeState);
  localStorage.setItem("widgetsState", JSON.stringify(widgetsState));

  const tempJson = {
    layout,
    storeState: JSON.parse(storeState),
    dsState: JSON.parse(dsState),
    widgetsState,
  };

  console.log(JSON.stringify(tempJson));
};

const loadDemo = async () => {
  const layoutReq = await fetch("/demo/layout.json");
  const layoutJson = await layoutReq.json();
  console.log(layout);

  layout = layoutJson.layout;

  manuallyUpdateLayout();

  Object.keys(layoutJson.widgetsState).forEach((key) => {
    const e = layoutJson.widgetsState[key];
    customWidgets.value.push({
      id: key,
      component: e.component,
      caption: e.caption,
      // state: e.state,
    });
  });

  dsManager.loadState(layoutJson.dsState);
  storeManager.loadState(layoutJson.storeState, EventBus);

  await nextTick();

  customWidgets.value.forEach((e) => {
    const refArr = refs.ctx.$refs[`${e.id}_component`];
    const ref = Array.isArray(refArr) ? refArr[0] : refArr;

    ref.setState(layoutJson.widgetsState[e.id].state);
    console.log(ref);
  });
};

const loadLayout = async () => {
  const retrievedObject =
    localStorage.getItem("testLayout") || JSON.stringify(layout);
  layout = JSON.parse(retrievedObject);

  manuallyUpdateLayout();
  console.log(layout);

  const dsState = localStorage.getItem("dsState");
  const storeState = localStorage.getItem("storeState");
  const widgetsState = localStorage.getItem("widgetsState");

  const widgetsStateObj = JSON.parse(widgetsState);

  Object.keys(widgetsStateObj).forEach((key) => {
    const e = widgetsStateObj[key];
    customWidgets.value.push({
      id: key,
      component: e.component,
      caption: e.caption,
      // state: e.state,
    });
  });
  console.log(customWidgets.value);

  dsManager.loadState(JSON.parse(dsState));
  storeManager.loadState(JSON.parse(storeState), EventBus);

  await nextTick();

  customWidgets.value.forEach((e) => {
    const refArr = refs.ctx.$refs[`${e.id}_component`];
    const ref = Array.isArray(refArr) ? refArr[0] : refArr;

    ref.setState(widgetsStateObj[e.id].state);
    console.log(ref);
  });
};

const openStoreList = () => {
  settingsSection.value = { type: "Stores" };
  showSidebar.value = true;
};

const openAppSettings = () => {
  settingsSection.value = { type: "App" };
  showSidebar.value = true;
};

const updateBackgroundColor = (newColor) => {
  settingsBackground.value = newColor;
};

const openSettings = (id, wrapperId, type = "Control") => {
  const refArr = refs.ctx.$refs[id];
  const ref = Array.isArray(refArr) ? refArr[0] : refArr;

  let wrapperRef = null;
  if (wrapperId) {
    const wrapperRefArr = refs.ctx.$refs[wrapperId];
    console.log(wrapperRefArr);
    wrapperRef = Array.isArray(wrapperRefArr)
      ? wrapperRefArr[0]
      : wrapperRefArr;
  }

  settingsSection.value = markRaw({
    type,
    component: ref,
    wrapper: wrapperRef,
    id,
  });
  showSidebar.value = true;
};

const deleteWidget = (id) => {
  if (settingsSection?.value && `${id}_component` === settingsSection.value.id) {
    showSidebar.value = false;
  }
  customWidgets.value = customWidgets.value.filter(widget => widget.id !== id);
};

const addImageWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 300,
    height: 150,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "ImageWidget",
    // storeId: store.id,
    caption: "Test",
  });
};

const addTextWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 300,
    height: 150,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "TextWidget",
    caption: "Test",
  });
};
const addPivotTable = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 800,
    height: 450,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "PivotTableWidget",
    caption: "Test",
  });
};

const addSvgWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 300,
    height: 300,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "SvgWidget",
    caption: "Test",
  });
};

const addRepeatableSvgWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 400,
    height: 400,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "RepeatableSvgWidget",
    caption: "Test",
  });
};

const addProgressWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 200,
    height: 200,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "ProgressWidget",
    caption: "Test",
  });
};

const addVideoWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 300,
    height: 200,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "VideoWidget",
    caption: "Test",
  });
};

const addIconWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 150,
    height: 150,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "IconWidget",
    caption: "Test",
  });
};

const addRichTextWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 300,
    height: 200,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "RichTextWidget",
    caption: "Test",
  });
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

.smartwidget .widget-body-simple .widget-body__content {
  width: 100%;
  height: 100%;
}

.smartwidget .widget-body[data-v-059e0ffc] {
  display: flex;
  flex-direction: column;
  will-change: height;
  position: relative;
  overflow: hidden;
}

.smartwidget .widget-body .widget-body__content {
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

.moveable-control.moveable-origin {
  display: none;
}

.va-dropdown__content {
  z-index: 10000000;
}

.app-layout-container.editDisabled .moveable-line {
  display: none;
}

.va-dropdown__content.va-select-dropdown__content.va-dropdown__content-wrapper {
  z-index: 20000000 !important;
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
  gap: 1rem;
  background: v-bind(settingsBackground);
}

.buttons-list {
  align-self: flex-end;
  order: 3;
}

.widgets-select {
  display: flex;
  align-self: flex-end;
}

.add-widget-btn {
  align-self: self-end;
  margin-left: 10px;
  height: 36px;
}

.main-section {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  gap: 1rem;
  overflow: auto;
  -webkit-box-shadow: 0px 0px 8px 1px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 0px 8px 1px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 0px 8px 1px rgba(34, 60, 80, 0.2);
}

.dashboard-container {
  flex-grow: 1;
  width: 100%;
  min-height: 100%;
  position: relative;
}

.dashboard-item {
  position: absolute;
  width: 100%;
  height: 100%;
}

.dashboard-item-container {
  position: absolute;
}

.dropdown-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.widget-content {
  position: absolute;
  width: 100%;
  height: 100%;
}

.target {
  width: 100%;
  height: 100%;
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

.app-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
}

.sidebar {
  z-index: 1000000;
  -webkit-box-shadow: -10px 0px 10px -2px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: -10px 0px 10px -2px rgba(34, 60, 80, 0.2);
  box-shadow: -10px 0px 10px -2px rgba(34, 60, 80, 0.2);
}
</style>
