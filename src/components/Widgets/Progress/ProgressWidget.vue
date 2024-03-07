<script lang="ts" setup>
import { ref, computed, inject, watch } from "vue";
import ProgressWidgetSettings from "./ProgressWidgetSettings.vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";
const settings = ProgressWidgetSettings;

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
  progress: {
    type: [Number, String],
    required: false,
    default: () => 0.5,
    validator: (value) => {
      return typeof value === 'string' || typeof value === 'number';
    },
  },
  fillColor: {
    type: Object,
    required: false,
    default: () => ({
      backgroundColor: '#00FF00',
      backgroundGradient: '#00FF00 0, #FAFAFA 85%'
    }),
  },
  backgroundColor: {
    type: String,
    required: false,
    default: "#d3d3d3",
  },
  isGradient: {
    type: Boolean,
    required: false,
    default: false,
  },
  isVertical: {
    type: Boolean,
    required: false,
    default: false,
  },
  rotation: {
    type: Number,
    required: false,
    default: 90,
  }
});

const { initialState } = props;

const innerProgress = ref(initialState?.progress || props.progress || 50);
const innerFillColor = ref(
  initialState?.innerFillColor || {
    backgroundColor: props.fillColor.backgroundColor || '#00FF00',
    backgroundGradient: props.fillColor.backgroundGradient || '#00FF00 0, #FAFAFA 100%',
  }
);
const innerBackgroundColor = ref(initialState?.backgroundColor || props.backgroundColor || '#d3d3d3');
const innerIsGradient = ref(initialState?.isGradient || props.isGradient || false);
const innerIsVertical = ref(initialState?.isVertical || props.isVertical || false);
const innerRotation = ref(initialState?.rotation || props.rotation || 90);

const getState = () => {
  return {
    progress: innerProgress.value,
    fillColor: innerFillColor.value,
    backgroundColor: innerBackgroundColor.value,
    isGradient: innerIsGradient.value,
    isVertical: innerIsGradient.value,
    rotation: innerRotation.value,
    storeId: storeId.value,
  };
};

const setState = (state) => {
  {
    innerProgress.value = state.progress;
    innerFillColor.value = state.fillColor;
    innerBackgroundColor.value = state.backgroundColor;
    innerIsGradient.value = state.isGradient;
    innerIsVertical.value = state.isVertical;
    innerRotation.value = state.rotation;
  }
}

defineExpose({
  progress: innerProgress,
  fillColor: innerFillColor,
  isGradient: innerIsGradient,
  isVertical: innerIsVertical,
  backgroundColor: innerBackgroundColor,
  rotation: innerRotation,
  storeId,
  getState,
  setState,
  settings,
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

watch(
  storeId, 
  (newVal, oldVal) => {
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

const parsedProgress = computed(() => {
  if (!isNaN(innerProgress.value)) return `${(innerProgress.value * 100).toFixed(2)}%`;
  
  let processedString = innerProgress.value;
  const regex = /{(.*?)}/g;
  const parts = processedString.match(regex);

  if (!parts || !data.value) return processedString;

  parts.forEach((element: string) => {
    const trimmedString = element.replace("{", "").replace("}", "");
    const dataField = trimmedString.split(".");

    const res = dataField.reduce((acc: any, field) => {
      return acc[field];
    }, data.value);

    processedString = processedString.replace(element, res);
  });
  return `${processedString}%`;
});

const backgroundProgressColor = computed(() => {
  return innerIsGradient.value
    ? `linear-gradient(${innerRotation.value}deg, ${innerFillColor.value.backgroundGradient})`
    : `${innerFillColor.value.backgroundColor}`;
});

const transition = computed(() => {
  return innerIsVertical.value ? 'height .7s ease' : 'width .7s ease';
});

const verticalPositionFiller = computed(() => {
  return innerIsVertical.value ? `${parseFloat(parsedProgress.value)}%` : '35px';
});

const horizontalPositionFiller = computed(() => {
  return !innerIsVertical.value ? `${parseFloat(parsedProgress.value)}%` : '35px';
});

const verticalPositionBackground = computed(() => {
  return innerIsVertical.value ? '35px' : '100%';
});

const horizontalPositionBackground = computed(() => {
  return !innerIsVertical.value ? '35px' : '100%';
});
</script>

<template>
  <div class="container">
    <div class="progress">
      <span>{{ parsedProgress }}</span>
      <div class="progress-percent"></div>
    </div>
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

.progress {
  width: v-bind(verticalPositionBackground);
  height: v-bind(horizontalPositionBackground);
  background: v-bind(innerBackgroundColor);
  border-radius: 10px;
  display: flex;
  align-items: end;
  position: relative;
}

.progress-percent {
  height: v-bind(verticalPositionFiller);
  width: v-bind(horizontalPositionFiller);
  background: v-bind(backgroundProgressColor);
  transition: v-bind(transition);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  z-index: 1000;
}
</style>
