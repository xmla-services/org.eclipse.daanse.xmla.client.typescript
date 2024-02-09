<script lang="ts" setup>
import { ref } from "vue";
import VideoWidgetSettings from "./VideoWidgetSettings.vue";
const settings = VideoWidgetSettings;


const props = defineProps({
  initialState: {
    type: Object,
    required: false,
  },
  videoUrl: {
    type: String,
    required: false,
    default: "",
  }
});

const innerVideoUrl = ref(props.videoUrl || "");
const videoSettings = ref({
  fit: "None",
})

defineExpose({
  videoUrl: innerVideoUrl,
  videoSettings,
  settings,
});
</script>

<template>
  <div class="container">
    <video controls :src="innerVideoUrl">
      Your browser does not support embedded videos.
    </video>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container video {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  object-fit: v-bind(videoSettings.fit);
}
</style>
