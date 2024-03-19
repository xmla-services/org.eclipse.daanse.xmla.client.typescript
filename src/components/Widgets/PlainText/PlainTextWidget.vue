<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { useStoreManager } from "@/composables/storeManager";
import { ref, inject, onMounted, watch, computed } from "vue";
import PlainTextWidgetSettings from "./PlainTextWidgetSettings.vue";
import type { Store } from "@/stores/Widgets/Store";

const EventBus = inject("customEventBus") as any;
const storeManager = useStoreManager();
const settings = PlainTextWidgetSettings;

const storeId = ref("");
const objectField = ref("description");
const text = ref("");

let store = null as unknown as Store;

const setSettings = (settings) => {
  if (settings.field) {
    objectField.value = settings.field;
  }

  if (settings.store) {
    storeId.value = settings.store;
  }
};

const props = defineProps({
  initialState: {
    type: Object,
    required: false,
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
  textAlign: {
    type: String,
    required: false,
    default: "left",
  },
  fontWeight: {
    type: String,
    required: false,
    default: "normal",
  },
});

const { initialState } = props;

const innerFontSize = ref(initialState?.fontSize || props.fontSize || 12);
const innerFontColor = ref(
  initialState?.fontColor || props.fontColor || "#000",
);
const innerTextAlign = ref(
  initialState?.textAlign || props.textAlign || "left",
);
const innerFontWeight = ref(
  initialState?.fontWeight || props.fontWeight || "normal",
);
const innerTextDecoration = ref("None");

watch(storeId, (newVal, oldVal) => {
  console.log("store changed", storeId);
  store = storeManager.getStore(storeId.value);

  console.log(oldVal, newVal);

  EventBus.off(`UPDATE:${oldVal}`, updateFn);
  EventBus.on(`UPDATE:${storeId.value}`, updateFn);

  getData();
});

const updateFn = async () => {
  text.value = (await store?.getData()) as string;
};

const getState = () => ({
  storeId: storeId.value,
  objectField: objectField.value,
  fontSize: innerFontSize.value,
  fontColor: innerFontColor.value,
  textAlign: innerTextAlign.value,
  fontWeight: innerFontWeight.value,
});

const setState = (state) => {
  storeId.value = state.storeId;
  objectField.value = state.objectField;
  innerFontSize.value = state.fontSize;
  innerFontColor.value = state.fontColor;
  innerTextAlign.value = state.textAlign;
  innerFontWeight.value = state.fontWeight;

  getData();
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
  setSettings,
  settings,
  objectField,
  storeId,
  getState,
  setState,
  fontSize: innerFontSize,
  fontColor: innerFontColor,
  textAlign: innerTextAlign,
  fontWeight: innerFontWeight,
  textDecoration: innerTextDecoration,
});

const getData = async () => {
  if (!store) return;
  updateFn();
};

onMounted(async () => {
  await getData();
});
</script>

<template>
  <div v-if="objectField" class="component">{{ text[objectField] }}</div>
</template>

<style scoped>
.component {
  font-size: v-bind(innerFontSize + "px");
  color: v-bind(innerFontColor);
  text-align: v-bind(innerTextAlign);
  font-weight: v-bind(innerFontWeight);
  text-decoration: v-bind(textDecorationStyle);
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
