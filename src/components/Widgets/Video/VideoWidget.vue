<script lang="ts" setup>
import { ref, inject, watch, computed } from "vue";
import VideoWidgetSettings from "./VideoWidgetSettings.vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";
const settings = VideoWidgetSettings;

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
  videoUrl: {
    type: String,
    required: false,
    default: "",
  }
});

const getState = () => {
  return {
    storeId: storeId.value,
  };
};

const getData = async () => {
  if (!store) return;
  updateFn();
};

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


const innerVideoUrl = ref(props.videoUrl || "");
const videoSettings = ref({
  fit: "None",
})

defineExpose({
  videoUrl: innerVideoUrl,
  videoSettings,
  storeId,
  settings,
  getState,
});

const videoUrlParced = computed(() => {
  let processedString = innerVideoUrl.value;
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
  <div class="container">
    <video controls :src="videoUrlParced">
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
