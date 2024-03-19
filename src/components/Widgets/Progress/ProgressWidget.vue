<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { ref, computed } from "vue";
import ProgressWidgetSettings from "./ProgressWidgetSettings.vue";
const settings = ProgressWidgetSettings;


const props = defineProps({
  initialState: {
    type: Object,
    required: false,
  },
  progress: {
    type: Number,
    required: false,
    default: 50,
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

const innerProgress = ref(props.progress || 50);
const innerFillColor = ref({
  backgroundColor: props.fillColor.backgroundColor || '#00FF00',
  backgroundGradient: props.fillColor.backgroundGradient || '#00FF00 0, #FAFAFA 100%',
});
const innerBackgroundColor = ref(props.backgroundColor || '#d3d3d3');
const innerIsGradient = ref(props.isGradient || false);
const innerIsVertical = ref(props.isVertical || false);
const innerRotation = ref(props.rotation || 90)

const backgroundProgressColor = computed(() => {
  return innerIsGradient.value
    ? `linear-gradient(${innerRotation.value}deg, ${innerFillColor.value.backgroundGradient})`
    : `${innerFillColor.value.backgroundColor}`;
})

const transition = computed(() => {
  return innerIsVertical.value ? 'height .7s ease' : 'width .7s ease';
})

const verticalPositionFiller = computed(() => {
  return innerIsVertical.value ? `${innerProgress.value}%` : '35px';
})

const horizontalPositionFiller = computed(() => {
  return !innerIsVertical.value ? `${innerProgress.value}%` : '35px';
})

const verticalPositionBackground = computed(() => {
  return innerIsVertical.value ? '35px' : '100%';
})

const horizontalPositionBackground = computed(() => {
  return !innerIsVertical.value ? '35px' : '100%';
})

defineExpose({
  progress: innerProgress,
  fillColor: innerFillColor,
  isGradient: innerIsGradient,
  isVertical: innerIsVertical,
  backgroundColor: innerBackgroundColor,
  rotation: innerRotation,
  settings,
});
</script>

<template>
  <div class="container">
    <div class="progress">
      <span>{{ `${innerProgress}%` }}</span>
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
