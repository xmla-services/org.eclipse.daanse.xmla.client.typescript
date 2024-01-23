<script lang="ts" setup>
import WidgetWrapperSettings from '../Widgets/WidgetWrapper/WidgetWrapperSettings.vue';

const props = defineProps(["component", "wrapper"]);
</script>

<template>
  <div class="sidebar-settings">
    <div class="sidebar-settings-title">
      <h2 class="mb-2">Widget settings</h2>
    </div>
    <div class="sidebar-settings-content">
      <WidgetWrapperSettings :wrapper="props.wrapper"></WidgetWrapperSettings>
      <component
        :is="props.component.settings"
        :component="props.component"
      ></component>
    </div>
  </div>
</template>

<style lang="css">
.sidebar-settings {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 10px;
  width: 100%;
}

.sidebar-settings-title {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.sidebar-settings-title > h2 {
  font-size: 24px;
  flex-grow: 1;
}

.sidebar-settings-content {
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}
</style>
