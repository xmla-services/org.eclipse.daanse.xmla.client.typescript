<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { ref, watch, onMounted, type Ref } from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";
import type { CollapseState, ProgressSharingComponentProps, GradientPart } from "@/@types/widgets";

const props = defineProps(["component"]) as ProgressSharingComponentProps;
const opened: Ref<CollapseState> = ref({
  textSection: false,
  storeSection: false,
});

const storeManager = useStoreManager();
let stores: Ref<any[]> = ref([]);
const requestResult: Ref<string> = ref("");
const storeId: Ref<string> = ref(props.component.storeId);
const fields: Ref<GradientPart[]> = ref([]);
const progress: Ref<string> = ref(props.component.progress);

const getStores = () => {
  const storeList = storeManager.getStoreList();

  stores.value = Array.from(storeList.value, function (entry) {
    return { ...entry[1] };
  });
};

const getData = async () => {
  const store = storeManager.getStore(storeId.value) as Store;

  const data = await store.getData();
  requestResult.value = JSON.stringify(data, null, 2);
};

const updateStore = (store) => {
  storeId.value = store;
  props.component.storeId = store;
  getData();
};

onMounted(() => {
  getStores();
  if (storeId.value) {
    getData();
  }
});

const addItem = () => {
  return fields.value.push({
    color: '#' + ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6),
    location: Math.floor(Math.random() * 101),
  })
};

watch(
  [() => props.component.fillColor?.backgroundColor, () => fields.value],
  ([backgroundColor, fields]) => {
    props.component.fillColor.backgroundColor = backgroundColor;

    props.component.fillColor.backgroundGradient = fields.length === 0
      ? `${backgroundColor} 0, #FAFAFA 85%`
      : fields.map((v: GradientPart) => `${v.color} ${v.location}%`).join(', ');
  },
  { deep: true }
);

const deleteField = (id: number) => {
  fields.value = fields.value.filter((_,i) => i !== id)
}

watch(
  () => progress.value,
  (newValue) => {
    if (typeof newValue === 'string') {
      const allowDot = !newValue.includes('.');
      const sanitizedValue = newValue.replace(/,/g, '.');
      const numericValue = parseFloat(sanitizedValue);

      if (!isNaN(numericValue) && allowDot) {
        const clampedValue = Math.max(0, Math.min(1, numericValue));
        progress.value = String(clampedValue);
        props.component.progress = String(clampedValue);
      } else {
        props.component.progress = newValue;
      }
    }
  }
);

</script>

<template>
  <va-collapse v-model="opened.textSection" header="Progress widget settings">
    <div class="settings-container">
      <va-input v-model="progress" label="Progress" />
      <va-color-input v-model="props.component.fillColor.backgroundColor" label="Progress fill color" />
      <va-color-input v-model="props.component.backgroundColor" label="Progress background color" />
      <va-checkbox v-model="props.component.isVertical" label="Vertical" />
      <va-checkbox v-model="props.component.isGradient" label="Gradient" />
    </div>
    <div
      class="mt-3"
      v-if="props.component.isGradient"
    >
      <va-button
        class="add-btn"
        @click="addItem"
      >
        Add color
      </va-button>
      <div>
        <va-input
          class="mt-2"
          v-model="props.component.rotation"
          label="Rotation" />
        <va-data-table
          class="table-config"
          :items="fields"
          :columns="[{ key: 'color' }, {key: 'location'}, {key: 'actions'}]"
        >
          <template #cell(color) = {rowIndex}>
            <va-color-input
              class="input-color"
              v-model="fields[rowIndex].color"
            />
          </template>
          <template #cell(location) = {rowIndex}>
            <va-input
              class="input"
              v-model="fields[rowIndex].location"
            />
          </template>
          <template #cell(actions) = {rowIndex}>
            <va-button
              icon="delete"
              color="danger"
              @click="deleteField(rowIndex)"
            />
          </template>
        </va-data-table>
      </div>
    </div>
  </va-collapse>
  <va-collapse v-model="opened.storeSection" header="Store settings">
    <div class="settings-container">
      <div>
        <h3 class="mb-2">Select store</h3>
        <div class="mb-2" v-for="store in stores" :key="store.id">
          <va-radio
            :model-value="storeId"
            @update:model-value="updateStore"
            :option="{
              text: `${store.caption} ${store.id}`,
              id: store.id,
            }"
            value-by="id"
            name="store-radio-group"
          />
        </div>
        <pre class="response">{{ requestResult }}</pre>
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
.add-btn {
  width: 150px;
}
.input {
  width: 100px;
}
</style>
