<script lang="ts" setup>
import { ref } from "vue";
import ImageWidgetSettings from "./ImageWidgetSettings.vue";
const settings = ImageWidgetSettings;

const { initialState } = defineProps(["initialState"]) as any;
const imgSrc = ref(initialState?.imgSrc || "");

const getState = () => {
  return {
    imgSrc: imgSrc.value,
  };
};

const setState = (state) => {
  imgSrc.value = state.imgSrc;
};

defineExpose({
  imgSrc,
  settings,
  getState,
  setState,
});
</script>

<template>
  <img class="image" :src="imgSrc" />
</template>

<style scoped>
.image {
  width: 100%;
  height: 100%;
}
</style>
