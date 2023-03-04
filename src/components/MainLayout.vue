<script setup lang="ts">
import Navbar from "./NavBar.vue";
import { useAppSettingsStore } from "@/stores/AppSettings";

const appSettings = useAppSettingsStore();
</script>

<template>
  <div class="app-layout-container">
    <navbar></navbar>
    <div v-if="appSettings.cubeOpened" class="split-container">
      <va-split
        class="split"
        :model-value="30"
        :limits="[
          ['600px', 'any'],
          ['500px', 'any'],
        ]"
      >
        <template #start>
          <div class="section-block">
            <slot name="left_container" />
          </div>
        </template>
        <template #end>
          <div class="section-block">
            <slot name="right_container" />
          </div>
        </template>
      </va-split>
    </div>
    <div v-else class="helper">
      <h2>Connect to the cube</h2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-layout-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.split-container {
  height: 100%;
  overflow: hidden;
}

.split {
  height: 100%;
  width: 100%;

  & .section-block {
    position: relative;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    user-select: none;
  }
}

.helper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
