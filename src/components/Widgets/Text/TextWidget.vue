<script lang="ts" setup>
import { ref, watch } from "vue";
import TextWidgetSettings from "./TextWidgetSettings.vue";
const settings = TextWidgetSettings;

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

const { initialState, text } = props;

const innerText = ref(initialState?.text || text || "");
const innerFontSize = ref(initialState?.fontSize || props.fontSize || 12);
const innerFontColor = ref(initialState?.fontColor || props.fontColor || "#000");
const innerTextAlign = ref(initialState?.textAlign || props.textAlign || "left");
const innerFontWeight = ref(initialState?.fontWeight || props.fontWeight || "normal");

const getState = () => {
  return {
    text: innerText.value,
    fontSize: innerFontSize.value,
    fontColor: innerFontColor.value,
    textAlign: innerTextAlign.value,
    fontWeight: innerFontWeight.value,
  };
};

const setState = (state) => {
  innerText.value = state.text;
  innerFontSize.value = state.fontSize;
  innerFontColor.value = state.fontColor;
  innerTextAlign.value = state.textAlign;
  innerFontWeight.value = state.fontWeight;
};

defineExpose({
  text: innerText,
  fontSize: innerFontSize,
  fontColor: innerFontColor,
  textAlign: innerTextAlign,
  fontWeight: innerFontWeight,
  settings,
  getState,
  setState,
});

watch(() => props.text, (newVal) => {
  innerText.value = newVal;
});
</script>

<template>
  <div class="component">{{ innerText }}</div>
</template>

<style scoped>
.component {
  font-size: v-bind(innerFontSize + "px");
  color: v-bind(innerFontColor);
  text-align: v-bind(innerTextAlign);
  font-weight: v-bind(innerFontWeight);
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>