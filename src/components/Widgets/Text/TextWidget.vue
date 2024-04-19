<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
interface ITextSettings {
  text: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
  textDecoration: string;
  horizontalAlign: string;
  verticalAlign: string;
}

interface ITextSettingsProps {
  text?: string;
  fontSize?: number;
  fontColor?: string;
  fontWeight?: string;
  textDecoration?: string;
  horizontalAlign?: string;
  verticalAlign?: string;
}

import { computed } from "vue";
import TextWidgetSettings from "./TextWidgetSettings.vue";
import { useSettings } from "@/composables/widgets/settings";
import { useStore } from "@/composables/widgets/store";
import { useSerialization } from "@/composables/widgets/serialization";
import type { Store } from "@/stores/Widgets/Store";

const settingsComponent = TextWidgetSettings;

const props = withDefaults(defineProps<ITextSettingsProps>(), {
  text: "",
  fontSize: 12,
  fontColor: "#000",
  fontWeight: "normal",
  textDecoration: "None",
  horizontalAlign: "Left",
  verticalAlign: "Top",
});

const { settings, setSetting } = useSettings<typeof props>(props);
const { store, data, setStore } = useStore<Store>();
const { getState } = useSerialization(settings);

defineExpose({
  setSetting,
  settings,
  settingsComponent,
  store,
  setStore,
  getState,
});

const textDecorationStyle = computed(() => {
  switch (settings.value.textDecoration) {
    case "Underline solid":
      return "underline solid";
    case "Underline dashed":
      return "underline dashed";
    case "Underline wavy":
      return "underline wavy";
    case "Line-through":
      return "line-through";
    case "Overline":
      return "overline";
    default:
      return "none";
  }
});

const parsedText = computed(() => {
  let processedString = settings.value.text;
  const regex = /{(.*?)}/g;
  const parts = processedString.match(regex);

  if (!parts || !data.value) {
    return processedString;
  }

  parts.forEach((element: string) => {
    const trimmedString = element.replace("{", "").replace("}", "");
    const dataField = trimmedString.split(".");

    const res = dataField.reduce((acc: any, field) => {
      return acc[field];
    }, data.value);

    processedString = processedString.replace(element, res);
  });
  return processedString;
});
</script>

<template>
  <div
    class="text-container"
    :style="{
      'justify-content':
        settings.verticalAlign === 'Top'
          ? 'flex-start'
          : settings.verticalAlign === 'Center'
            ? 'center'
            : 'flex-end',
    }"
  >
    <div class="component">
      {{ parsedText }}
    </div>
  </div>
</template>

<style scoped>
.text-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 1rem;
  align-items: stretch;
}

.component {
  font-size: v-bind(settings.fontSize + "px");
  color: v-bind(settings.fontColor);
  text-align: v-bind(settings.horizontalAlign);
  font-weight: v-bind(settings.fontWeight);
  text-decoration: v-bind(textDecorationStyle);
  overflow: hidden;
}
</style>
