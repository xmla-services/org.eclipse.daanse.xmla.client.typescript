<script lang="ts" setup>
import { ref } from "vue";

const fullscreenEnabled = ref(false);

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: "",
  },
  backgroundColor: {
    type: String,
    required: false,
    default: "#fff",
  },
  titleColor: {
    type: String,
    required: false,
    default: "#000",
  },
  titleFontSize: {
    type: Number,
    required: false,
    default: 20,
  },
  borderSize: {
    type: Number,
    required: false,
    default: 1,
  },
  borderColor: {
    type: String,
    required: false,
    default: "#000",
  },
  borderRadius: {
    type: Number,
    required: false,
    default: 4,
  },
  fullscreen: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const innerTitle = ref(props.title);
const innerBackgroundColor = ref(props.backgroundColor);
const innerTitleColor = ref(props.titleColor);
const innerTitleFontSize = ref(props.titleFontSize);
const innerBorderSize = ref(props.borderSize);
const innerBorderColor = ref(props.borderColor);
const innerBorderRadius = ref(props.borderRadius);
const innerFullscreen = ref(props.fullscreen);

defineExpose({
  title: innerTitle,
  backgroundColor: innerBackgroundColor,
  titleColor: innerTitleColor,
  titleFontSize: innerTitleFontSize,
  borderSize: innerBorderSize,
  borderColor: innerBorderColor,
  borderRadius: innerBorderRadius,
  fullscreen: innerFullscreen,
});
</script>

<template>
  <div class="wrapper-container">
    <div v-if="innerFullscreen" class="wrapper-fullscreen_icon">
      <VaButton
        preset="secondary"
        icon="fullscreen"
        @click="fullscreenEnabled = true"
      />
    </div>
    <div v-if="innerTitle" class="wrapper-title">{{ innerTitle }}</div>
    <slot></slot>
  </div>
  <template v-if="fullscreenEnabled">
    <Teleport to="body">
      <div class="fullscreen-container">
        <div class="wrapper-fullscreen_icon">
          <VaButton
            preset="secondary"
            icon="close"
            @click="fullscreenEnabled = false"
          />
        </div>
        <div v-if="innerTitle" class="wrapper-title">{{ innerTitle }}</div>
        <slot></slot>
      </div>
    </Teleport>
  </template>
</template>

<style scoped>
.wrapper-container {
  display: flex;
  position: relative;
  flex-direction: column;
  background-color: v-bind(innerBackgroundColor);
  border-color: v-bind(innerBorderColor);
  border-width: v-bind(borderSize + "px");
  border-style: solid;
  border-radius: v-bind(innerBorderRadius + "px");
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.component {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.wrapper-title {
  padding: 8px;
  font-size: v-bind(innerTitleFontSize + "px");
  font-weight: 600;
  text-transform: capitalize;
  color: v-bind(innerTitleColor);
}

.wrapper-fullscreen_icon {
  background-color: #eee;
  color: #333;
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 4px;
  z-index: 1000;
}

.fullscreen-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 10000000000;
}
</style>
