<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
export interface IIconSettingsProps {
  initialState?: any;
  currentIcon?: string;
  iconColor?: string;
  iconSize?: number;
  isIconFilled?: boolean;
  strokeWeight?: number;
  opticSize?: number;
  grade?: number;
}

import { computed } from "vue";
import { useSettings } from "@/composables/widgets/settings";
import { useStore } from "@/composables/widgets/store";
import { useSerialization } from "@/composables/widgets/serialization";
import type { Store } from "@/stores/Widgets/Store";
import IconWidgetSettings from "./IconWidgetSettings.vue";

const settingsComponent = IconWidgetSettings;

const props = withDefaults(defineProps<IIconSettingsProps>(), {
  currentIcon: "",
  iconColor: "#000",
  iconSize: 100,
  isIconFilled: false,
  strokeWeight: 100,
  opticSize: 48,
  grade: 48,
});

const { settings, setSetting } = useSettings<typeof props>(props);
const { store, setStore } = useStore<Store>();
const { getState } = useSerialization(settings);

const iconStyle = computed(() => {
  return `
    font-variation-settings: 
      'FILL' ${+settings.value.isIconFilled}, 
      'wght' ${settings.value.strokeWeight}, 
      'GRAD' ${settings.value.grade}, 
      'opsz' ${settings.value.opticSize};
  `;
});

defineExpose({
  setSetting,
  settings,
  settingsComponent,
  getState,
  store,
  setStore,
});
</script>

<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    rel="stylesheet"
  />
  <div class="icon">
    <div :style="iconStyle">
      <span class="material-symbols-outlined">{{ settings.currentIcon }}</span>
    </div>
  </div>
</template>

<style scoped>
.icon {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.material-symbols-outlined {
  font-family: "Material Symbols Outlined";
  font-weight: normal;
  font-style: normal;
  font-size: v-bind(`${settings.iconSize}px`);
  color: v-bind(settings.iconColor);
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
}
</style>
