<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits();
const updateBackgroundColor = () => {
  emit('updateBackgroundColor', innerBackground.value);
};
const innerBackground = ref('#fafafa');

</script>

<template>
  <div class="app-settings">
    <div class="app-settings-title">
      <h2 class="mb-3">App settings</h2>
      <va-color-input
        v-model="innerBackground"
        @input="updateBackgroundColor"
        label="Background color"/>
    </div>
  </div>
</template>

<style lang="css">
.app-settings {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 10px;
  width: 100%;
}

.app-settings-title {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.app-settings-title > h2 {
  font-size: 24px;
  flex-grow: 1;
}
</style>
