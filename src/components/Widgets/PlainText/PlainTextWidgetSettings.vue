<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";

const props = defineProps(["component"]) as any;
const options = ref([]) as Ref<any[]>;
const requestResult = ref("");
const field = ref(props.component.objectField);
const storeId = ref(props.component.storeId);
const storeManager = useStoreManager();
let stores = ref([]) as Ref<any[]>;

const getData = async () => {
  const store = storeManager.getStore(storeId.value) as Store;

  const data = await store.getData();
  requestResult.value = JSON.stringify(data, null, 2);
  options.value = Object.keys(data);
};

const getStores = () => {
  const storeList = storeManager.getStoreList();

  stores.value = Array.from(storeList.value, function (entry) {
    return { ...entry[1] };
  });
};

const updateStore = (store) => {
  storeId.value = store;
  props.component.setSettings({
    store: store,
  });
  getData();
};

const updateField = (fieldVal) => {
  field.value = fieldVal;

  props.component.setSettings({
    field: field.value,
  });
};

onMounted(() => {
  getStores();
  if (storeId.value) {
    getData();
  }
});
</script>

<template>
  <div class="mt-4 mb-4">
    <h3 class="mb-2">Select store</h3>
    <div v-for="store in stores" :key="store.id">
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
  </div>
  <div>
    <va-select
      class="mb-2 input"
      :model-value="field"
      @update:model-value="updateField"
      :options="options"
      placeholder="Select field"
      label="Select field to be displayed in widget"
    />
    <pre class="response">{{ requestResult }}</pre>
  </div>
  <va-input v-model="props.component.fontSize" label="Font Size" />
  <va-input v-model="props.component.fontColor" label="Font Color" />
  <va-input v-model="props.component.textAlign" label="Text Align" />
  <va-input v-model="props.component.fontWeight" label="Font Weight" />
  <va-select
    v-model="props.component.textDecoration"
    label="Text decoration"
    :options="[
      'Underline solid',
      'Underline dashed',
      'Underline wavy',
      'Line-through',
      'Overline',
      'None',
    ]"
  >
  </va-select>
</template>
<style>
.response {
  background-color: lightgrey;
  padding: 0.5rem;
  border-radius: 4px;
  max-height: 400px;
  overflow: auto;
}
</style>
