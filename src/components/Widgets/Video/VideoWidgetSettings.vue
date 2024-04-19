<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { ref, onMounted, type Ref } from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";
import type { CollapseState, VideoSharingComponentProps } from "@/@types/widgets";

const props = defineProps(["component"]) as VideoSharingComponentProps;
const opened: Ref<CollapseState> = ref({
  textSection: false,
  storeSection: false,
});

const storeManager = useStoreManager();
let stores: Ref<any[]> = ref([]) as Ref<any[]>;
const requestResult: Ref<string> = ref("");
const storeId: Ref<string> = ref(props.component.storeId);

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

</style>
