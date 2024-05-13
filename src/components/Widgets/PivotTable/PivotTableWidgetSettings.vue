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

const props = defineProps(["component"]) as any;
const storeId = ref(props.component.storeId);
const storeManager = useStoreManager();
let stores = ref([]) as Ref<any[]>;

const getStores = () => {
  const storeList = storeManager.getStoreList();

  stores.value = Array.from(storeList.value, function (entry) {
    return { ...entry[1] };
  });
};

const updateStore = async (storeIdSelected) => {
  storeId.value = storeIdSelected;
  props.component.storeId = storeId.value;
};

onMounted(() => {
  getStores();
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
