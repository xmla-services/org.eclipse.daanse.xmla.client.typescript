<script lang="ts" setup>
import { ref } from "vue";
import TextWidgetSettings from "./TextWidgetSettings.vue";
const settings = TextWidgetSettings;

const { initialState } = defineProps(["initialState"]) as any;
const text = ref(initialState?.text || "");

const getState = () => {
  return {
    text: text.value,
  };
};

const setState = (state) => {
  text.value = state.text;
};

defineExpose({
  text,
  settings,
  getState,
  setState,
});
</script>

<template>
  <div>{{ text }}</div>
</template>
