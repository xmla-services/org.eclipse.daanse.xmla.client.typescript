<script lang="ts" setup>
import StoreList from "@/components/Sidebar/StoreList.vue";
import SidebarControl from "@/components/Sidebar/SidebarControl.vue";
import SidebarWidget from "@/components/Sidebar/SidebarWidget.vue";
import SidebarAppSettings from "./SidebarAppSettings.vue";

const props = defineProps(["modelValue", "settingsSection"]);

const emit = defineEmits(["update:modelValue", "updateBackgroundColor"]);

const updateBackgroundColor = (color) => {
 emit('updateBackgroundColor', color);
};
</script>

<template>
  <va-sidebar :modelValue="modelValue" animated="right" width="500px">
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
          <SidebarAppSettings
            @updateBackgroundColor="updateBackgroundColor"
          />
        </template>
      </div>
      <div class="settings-sidebar-actions">
        <va-button @click="$emit('update:modelValue', !modelValue)">
          Close
        </va-button>
      </div>
    </div>
  </va-sidebar>
</template>

<style lang="css">
.settings-sidebar {
  background-color: white;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;

  padding-bottom: 20px;
}

.settings-sidebar-content {
  flex-grow: 1;
  width: 100%;
}

.settings-sidebar-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
