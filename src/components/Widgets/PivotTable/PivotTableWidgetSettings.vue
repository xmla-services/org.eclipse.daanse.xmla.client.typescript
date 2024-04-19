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
const requestResult = ref("");
const catalogs = ref([]) as Ref<any[]>;
const cubes = ref([]) as Ref<any[]>;
// const field = ref(props.component.objectField);
const storeId = ref(props.component.storeId);
const storeManager = useStoreManager();
let stores = ref([]) as Ref<any[]>;

const getData = async () => {

  // console.log(store);
  // const data = await store.getData();
  // console.log(data);
};

const getStores = () => {
  const storeList = storeManager.getStoreList();

  stores.value = Array.from(storeList.value, function (entry) {
    return { ...entry[1] };
  });
};

const updateStore = async (storeIdSelected) => {
  storeId.value = storeIdSelected;
  props.component.storeId = storeId.value;

  const store = storeManager.getStore(storeId.value) as Store;
  const ds = store.getDatasource();
  const api = ds.getApi();

  catalogs.value = (await api.getCatalogs()).catalogs;
};

const updateCatalog = async (catalogName) => {
  const catalog = catalogs.value.find((c) => c.CATALOG_NAME === catalogName);
  props.component.catalog = catalog;

  const store = storeManager.getStore(storeId.value) as Store;
  const ds = store.getDatasource();
  const api = ds.getApi();

  cubes.value = (await api.getCubes(catalog.CATALOG_NAME)).cubes;
};

const updateCube = (cubeName) => {
  const cube = cubes.value.find((c) => c.CUBE_NAME === cubeName);
  props.component.cube = cube;
};

// const updateField = (fieldVal) => {
//   field.value = fieldVal;

//   props.component.setSettings({
//     field: field.value,
//   });
// };

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
  <div v-if="props.component.storeId">
    <va-select
      class="mb-2 input"
      :model-value="props.component.catalog?.CATALOG_NAME"
      @update:model-value="updateCatalog"
      text-by="CATALOG_NAME"
      value-by="CATALOG_NAME"
      :options="catalogs"
      placeholder="Select catalog"
      label="Select catalog"
    />
  </div>
  <div v-if="props.component.catalog">
    <va-select
      class="mb-2 input"
      :model-value="props.component.cube?.CUBE_NAME"
      @update:model-value="updateCube"
      text-by="CUBE_NAME"
      value-by="CUBE_NAME"
      :options="cubes"
      placeholder="Select cube"
      label="Select cube"
    />
  </div>
  <div>
    <h3 class="mb-2">MDX</h3>
    <va-textarea
      style="width: 100%; height: 500px"
      v-model="props.component.mdx"
    />
  </div>
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
