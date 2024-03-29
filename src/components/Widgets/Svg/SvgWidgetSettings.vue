<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps(["component"]) as any;
const opened = ref({
  textSection: false,
  storeSection: false,
});

const fields = ref([{className: '', fill: '', stroke: '', strokeWidth: ''}]);
const addItems = () => {
  return fields.value.push({
    className: '',
    fill: '',
    stroke: '',
    strokeWidth: '',
  })
};

watch(
  fields,
  () => {
    const config = {};
    fields.value.forEach(
      ({ className, fill, stroke, strokeWidth }) => {
        if (!config[className]) {
          config[className] = { fill, stroke, strokeWidth };
        }
      },
    {});
    props.component.classesConfig = {...config};
  },
  {deep: true}
);
</script>

<template>
  <va-collapse v-model="opened.textSection" header="SVG  widget settings">
    <div class="settings-container">
      <va-input v-model="props.component.src" label="SVG" />
      <va-button
        class="add-button"
        @click="addItems"
      >
        Add items
      </va-button>
        <va-data-table
          class="table-config"
          :items="fields"
          :columns="[{ key: 'className' }, { key: 'fill' }, { key: 'stroke' }, { key: 'strokeWidth'}]"
        >
          <template #cell(className) = {rowIndex}>
            <va-input
              class="input-class-name"
              v-model="fields[rowIndex].className"
            />
          </template>
          <template #cell(fill) = {rowIndex}>
            <va-color-input
              class="color-fill"
              v-model="fields[rowIndex].fill"
            />
          </template>
          <template #cell(stroke) = {rowIndex}>
            <va-color-input
              class="color-stroke"
              v-model="fields[rowIndex].stroke"
            />
          </template>
          <template #cell(strokeWidth) = {rowIndex}>
            <va-input
              class="input-stroke-width"
              v-model="fields[rowIndex].strokeWidth"
            />
          </template>
        </va-data-table>
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

.input-class-name {
  width: 100px;
}

.color-fill {
  width: 100px;
}

.color-stroke {
  width: 100px;
}

.input-stroke-width {
  width: 50px;
}

.add-button {
  width: 33%;
}
</style>
