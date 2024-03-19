<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import {computed, ref} from "vue";

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
  backgroundColor_transparence:{
    type: Number,
    required: false,
    default: 255,
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
  shadow_color: {
    type: String,
    required: false,
    default: '#000',
  },
  shadow_blur: {
    type: Number,
    required: false,
    default: 0,
  },
  shadow_x: {
    type: Number,
    required: false,
    default: 0,
  },
  shadow_y: {
    type: Number,
    required: false,
    default: 0,
  },
  shadow_transparence: {
    type: Number,
    required: false,
    default: 255,
  },
  transparency: {
    type: Number,
    required: false,
    default: 1,
  },

});

const innerTitle = ref(props.title);
const innerBackgroundColor = ref(props.backgroundColor);
const innerBackgroundColor_transparence = ref(props.backgroundColor_transparence);
const innerTitleColor = ref(props.titleColor);
const innerTitleFontSize = ref(props.titleFontSize);
const innerBorderSize = ref(props.borderSize);
const innerBorderColor = ref(props.borderColor);
const innerBorderRadius = ref(props.borderRadius);
const innerFullscreen = ref(props.fullscreen);
const innerShadow_color = ref(props.shadow_color);
const innerShadow_blur = ref(props.shadow_blur);
const innerShadow_x = ref(props.shadow_x);
const innerShadow_y = ref(props.shadow_y);
const innerShadowTransparence = ref(props.shadow_transparence);
const innerTransparency = ref(props.transparency);


const getState = () => ({
  title: innerTitle.value,
  backgroundColor: innerBackgroundColor.value,
  backgroundColor_transparence:innerBackgroundColor_transparence.value,
  titleColor: innerTitleColor.value,
  titleFontSize: innerTitleFontSize.value,
  borderSize: innerBorderSize.value,
  borderColor: innerBorderColor.value,
  borderRadius: innerBorderRadius.value,
  fullscreen: innerFullscreen.value,
  shadow_color:innerShadow_color.value,
  shadow_blur:innerShadow_blur.value,
  shadow_x:innerShadow_x.value,
  shadow_y:innerShadow_y.value,
  shadow_transparence:innerShadowTransparence.value,
  transparency:innerTransparency.value,

});

const setState = (state) => {
  innerTitle.value = state.title;
  innerBackgroundColor.value = state.backgroundColor;
  innerBackgroundColor_transparence.value = state.backgroundColor_transparence;
  innerTitleColor.value = state.titleColor;
  innerTitleFontSize.value = state.titleFontSize;
  innerBorderSize.value = state.borderSize;
  innerBorderColor.value = state.borderColor;
  innerBorderRadius.value = state.borderRadius;
  innerFullscreen.value = state.fullscreen;
  innerShadow_color.value = state.shadow_color;
  innerShadow_blur.value = state.shadow_blur;
  innerShadow_x.value = state.shadow_x;
  innerShadow_y.value = state.shadow_y;
  innerShadowTransparence.value = state.shadow_transparence;
  innerTransparency.value = state.transparency;
  getData();
};

const getData=function(){
}
defineExpose({
  title: innerTitle,
  backgroundColor: innerBackgroundColor,
  backgroundColor_transparence:innerBackgroundColor_transparence,
  titleColor: innerTitleColor,
  titleFontSize: innerTitleFontSize,
  borderSize: innerBorderSize,
  borderColor: innerBorderColor,
  borderRadius: innerBorderRadius,
  fullscreen: innerFullscreen,
  shadow_color:innerShadow_color,
  shadow_blur:innerShadow_blur,
  shadow_x:innerShadow_x,
  shadow_y:innerShadow_y,
  shadow_transparence:innerShadowTransparence,
  transparency:innerTransparency,
  getState,
  setState
});

const getShadow = computed(()=>{
  let post = ''
  if(innerShadowTransparence.value) {
    post = innerShadowTransparence.value.toString(16);
  }
  let color = innerShadow_color.value.replace('#','');
  if(color.length == 3){
    color = color[0]+color[0]+color[1]+color[1]+color[2]+color[2];
  }

  const ret = `${innerShadow_x.value}px ${innerShadow_y.value}px ${innerShadow_blur.value}px #${color}${post}`;
  return ret;
});
const getBackground = computed(()=>{
  let post = ''
  if(innerBackgroundColor_transparence.value) {
    post = innerBackgroundColor_transparence.value.toString(16);
  }
  let color = innerBackgroundColor.value.replace('#','');
  if(color.length == 3){
    color = color[0]+color[0]+color[1]+color[1]+color[2]+color[2];
  }

  const ret = `#${color}${post}`;
  return ret;
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
  background-color: v-bind(getBackground);
  border-color: v-bind(innerBorderColor);
  border-width: v-bind(innerBorderSize + "px");
  border-style: solid;
  border-radius: v-bind(innerBorderRadius + "px");
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-Shadow: v-bind(getShadow);
  opacity:v-bind(innerTransparency);
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
