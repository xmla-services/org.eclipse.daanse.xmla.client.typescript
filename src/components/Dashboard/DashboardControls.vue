<template>
  <div class="controls-container">
    <va-button icon="settings" size="small" @click="$emit('openSettings')" />
  </div>
</template>
<style>
.controls-container {
  position: absolute;
  top: -23px;
  right: 0;
  height: 40px;
}
</style>
