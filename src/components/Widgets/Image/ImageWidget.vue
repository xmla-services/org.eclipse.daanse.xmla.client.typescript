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

defineExpose({
  imgSrc,
  settings,
  getState,
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
