<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import StoreList from "@/components/Sidebar/StoreList.vue";
import SidebarControl from "@/components/Sidebar/SidebarControl.vue";
import SidebarWidget from "@/components/Sidebar/SidebarWidget.vue";
import SidebarAppSettings from "./SidebarAppSettings.vue";

const props = defineProps(["modelValue", "settingsSection"]);

const emit = defineEmits(["update:modelValue", "updateBackgroundColor"]);

const updateBackgroundColor = (color) => {
  emit("updateBackgroundColor", color);
};
</script>

<template>
  <va-sidebar
    color="#ffffff"
    :modelValue="modelValue"
    animated="right"
    width="500px"
  >
    <div class="settings-sidebar">
      <div class="settings-sidebar-content">
        <template v-if="props.settingsSection?.type === 'Stores'">
          <StoreList></StoreList>
        </template>
        <template v-if="props.settingsSection?.type === 'Control'">
          <SidebarControl
            :component="props.settingsSection.component"
            :key="props.settingsSection.id"
          />
        </template>
        <template v-if="props.settingsSection?.type === 'Widget'">
          <SidebarWidget
            :component="props.settingsSection.component"
            :wrapper="props.settingsSection.wrapper"
            :key="props.settingsSection.id"
          />
        </template>
        <template v-if="props.settingsSection?.type === 'App'">
          <SidebarAppSettings @updateBackgroundColor="updateBackgroundColor" />
        </template>
      </div>

      <div class="settings-sidebar-actions">
        <va-button
          class="sidebar-button-close"
          preset="primary"        
          @click="$emit('update:modelValue', !modelValue)"
        >
          Close
        </va-button>
        <va-button
          class="sidebar-button-done ml-2"
          color="#4153B5"        
        >
          Done
        </va-button>
      </div>
    </div>
  </va-sidebar>
</template>

<style lang="scss">

.settings-sidebar {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;

  padding-bottom: 20px;
  justify-content: space-between;
}

.settings-sidebar-content {
  flex-grow: 1;
  width: 100%;
}

.settings-sidebar-actions {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 12px;
  right: 32px;
}
</style>
<style lang="scss" scoped>
.sidebar{
  background-color: white;
}

.sidebar-button-done {
  height: 100%;
  border: 2px solid transparent;
  box-sizing: border-box;

  &:hover {
    color: #1A2D91 !important;
    --va-background-color: #B0BEFE !important;
    --va-background-color-opacity: 1 !important;
  }

  &:active {
    color: #1A2D91 !important;
    border: 2px solid #4153B5 !important;
    --va-background-color: #fafafa !important;
  }
}

.sidebar-button-close {
  height: 100%;
  border-radius: 72px;
  border: 2px solid transparent;
  color: #1A2D91 !important;
  box-sizing: border-box;

  --va-background-color: #fafafa !important;

  &:hover {
    --va-background-color: #B0BEFE !important;
    --va-background-color-opacity: 1 !important;
  }

  &:active {
    border: 2px solid #4153B5 !important;

    --va-background-color: #fafafa !important;
  }
}
</style>
