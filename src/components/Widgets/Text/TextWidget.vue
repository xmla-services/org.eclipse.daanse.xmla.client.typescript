<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { ref, watch, computed, inject } from "vue";
import TextWidgetSettings from "./TextWidgetSettings.vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";
const settings = TextWidgetSettings;

const EventBus = inject("customEventBus") as any;
const storeManager = useStoreManager();
const storeId = ref("");
const data = ref(null as unknown);

let store = null as unknown as Store;

const props = defineProps({
  initialState: {
    type: Object,
    required: false,
  },
  text: {
    type: String,
    required: false,
    default: "",
  },
  fontSize: {
    type: Number,
    required: false,
    default: 12,
  },
  fontColor: {
    type: String,
    required: false,
    default: "#000",
  },
  fontWeight: {
    type: String,
    required: false,
    default: "normal",
  },
  textDecoration: {
    type: String,
    required: false,
    default: "None",
  },
  horizontalAlign: {
    type: String,
    required: false,
    default: "Left",
  },
  verticalAlign: {
    type: String,
    required: false,
    default: "Top",
  },
});

const { initialState, text } = props;

const innerText = ref(initialState?.text || text || "");
const innerFontSize = ref(initialState?.fontSize || props.fontSize || 12);
const innerFontColor = ref(
  initialState?.fontColor || props.fontColor || "#000",
);
const innerFontWeight = ref(
  initialState?.fontWeight || props.fontWeight || "normal",
);
const innerTextDecoration = ref(
  initialState?.textDecoration || props.textDecoration || "None",
);
const innerVerticalAlign = ref(
  initialState?.verticalAlign || props.verticalAlign || "Top",
);
const innerHorizontalAlign = ref(
  initialState?.horizontalAlign || props.horizontalAlign || "Left",
);

const getState = () => {
  return {
    text: innerText.value,
    fontSize: innerFontSize.value,
    fontColor: innerFontColor.value,
    fontWeight: innerFontWeight.value,
    textDecoration: innerTextDecoration.value,
    verticalAlign: innerVerticalAlign.value,
    horizontalAlign: innerHorizontalAlign.value,
    storeId: storeId.value,
  };
};

const setState = (state) => {
  innerText.value = state.text;
  innerFontSize.value = state.fontSize;
  innerFontColor.value = state.fontColor;
  innerFontWeight.value = state.fontWeight;
  innerTextDecoration.value = state.textDecoration;
  innerVerticalAlign.value = state.verticalAlign;
  innerHorizontalAlign.value = state.horizontalAlign;
};

const textDecorationStyle = computed(() => {
  switch (innerTextDecoration.value) {
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

defineExpose({
  text: innerText,
  fontSize: innerFontSize,
  fontColor: innerFontColor,
  fontWeight: innerFontWeight,
  textDecoration: innerTextDecoration,
  horizontalAlign: innerHorizontalAlign,
  verticalAlign: innerVerticalAlign,
  storeId,
  settings,
  getState,
  setState,
});

const getData = async () => {
  if (!store) return;
  updateFn();
};

watch(
  () => props,
  (newVal) => {
    setState(newVal);
  },
  { deep: true },
);

watch(storeId, (newVal, oldVal) => {
  console.log("store changed", storeId);
  store = storeManager.getStore(storeId.value);

  console.log(oldVal, newVal);

  EventBus.off(`UPDATE:${oldVal}`, updateFn);
  EventBus.on(`UPDATE:${storeId.value}`, updateFn);

  getData();
});

const updateFn = async () => {
  data.value = await store?.getData();
  console.log(data);
};

const parsedText = computed(() => {
  let processedString = innerText.value;
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
        innerVerticalAlign === 'Top'
          ? 'flex-start'
          : innerVerticalAlign === 'Center'
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
  font-size: v-bind(innerFontSize + "px");
  color: v-bind(innerFontColor);
  text-align: v-bind(innerHorizontalAlign);
  font-weight: v-bind(innerFontWeight);
  text-decoration: v-bind(textDecorationStyle);
  overflow: hidden;
}
</style>
