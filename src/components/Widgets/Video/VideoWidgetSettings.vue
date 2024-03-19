<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps(["component"]) as any;
const opened = ref({
  textSection: false,
  storeSection: false,
});

</script>

<template>
  <va-collapse v-model="opened.textSection" header="Video widget settings">
    <div class="settings-container">
      <va-input v-model="props.component.videoUrl" label="Video url" />
      <va-select
        class="mt-2"
        v-model="props.component.videoSettings.fit"
        label="Fit"
        :options="['Cover', 'Contain', 'Stretch', 'Fill', 'None']"
      >
      </va-select>
    </div>
  </va-collapse>
  <va-collapse v-model="opened.storeSection" header="Store settings">
    <div class="settings-container">
      <div>
        <h3 class="mb-2">Select store</h3>
      </div>
    </div>
  </va-collapse>
</template>
<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}

</style>
