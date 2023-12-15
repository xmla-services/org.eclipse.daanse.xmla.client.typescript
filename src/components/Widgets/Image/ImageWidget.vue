<script lang="ts" setup>
import { ref, watch } from "vue";
import ImageWidgetSettings from "./ImageWidgetSettings.vue";
const settings = ImageWidgetSettings;


const props = defineProps({ 
  initialState: {
    type: Object,
    required: false,
  },
  imgSrc: {
    type: String,
    required: false,
    default: "",
  }
});
const { initialState, imgSrc } = props;

const innerImgSrc = ref(initialState?.imgSrc || imgSrc || "");

const getState = () => {
  return {
    imgSrc: innerImgSrc.value,
  };
};

watch(() => props.imgSrc, (newVal) => {
  innerImgSrc.value = newVal;
});

const setState = (state) => {
  innerImgSrc.value = state.imgSrc;
};

defineExpose({
  imgSrc: innerImgSrc,
  settings,
  getState,
  setState,
});
</script>

<template>
  <img class="image" :src="innerImgSrc" />
</template>

<style scoped>
.image {
  width: 100%;
  height: 100%;
}
</style>
