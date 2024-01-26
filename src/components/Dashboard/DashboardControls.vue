<template>
  <div class="controls-container">
    <va-button icon="settings" size="small" @click="$emit('openSettings')" />
    <va-button icon="clear" color="danger" size="small" @click="$emit('deleteWidget')" />
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
