<script lang="ts" setup>
import { ref, computed } from "vue";
import IconWidgetSettings from "./IconWidgetSettings.vue";
const settings = IconWidgetSettings;

const props = defineProps({
  initialState: {
    type: Object,
    required: false,
  },
  currentIcon: {
    type: String,
    required: false,
    default: "",
  },
  iconColor: {
    type: String,
    required: false,
    default: "#000",
  },
  iconSize: {
    type: Number,
    required: false,
    default: 100,
  },
  isIconFilled: {
    type: Boolean,
    required: false,
    default: false,
  },
  strokeWeight: {
    type: Number,
    required: false,
    default: 100,
  },
  opticSize: {
    type: Number,
    required: false,
    default: 48,
  },
  emphasis: {
    type: Number,
    required: false,
    default: 0,
  }
});

const innerCurrentIcon = ref(props.currentIcon || "");
const innerIconColor = ref(props.iconColor || "#000");
const innerIconSize = ref(props.iconSize || 100);
const innerIsIconFilled = ref(props.isIconFilled || false);
const innerStrokeWeight = ref(props.strokeWeight || 100);
const innerOpticSize = ref(props.opticSize || 48);
const innerEmphasis = ref(props.emphasis || 48);

const iconStyle = computed(() => {
  return `
    font-variation-settings: 
      'FILL' ${+innerIsIconFilled.value}, 
      'wght' ${innerStrokeWeight.value}, 
      'GRAD' ${innerEmphasis.value}, 
      'opsz' ${innerOpticSize.value};
  `
});

defineExpose({
  currentIcon: innerCurrentIcon,
  iconColor: innerIconColor,
  iconSize: innerIconSize,
  isIconFilled: innerIsIconFilled,
  strokeWeight: innerStrokeWeight,
  opticSize: innerOpticSize,
  emphasis: innerEmphasis,
  settings,
});
</script>

<template>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
  <div class="icon">
    <div :style="iconStyle">
      <span class="material-symbols-outlined">{{ innerCurrentIcon }}</span>
    </div>
  </div>
</template>

<style scoped>
.icon {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: v-bind(`${innerIconSize}px`);
  color: v-bind(innerIconColor);
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
}
</style>
