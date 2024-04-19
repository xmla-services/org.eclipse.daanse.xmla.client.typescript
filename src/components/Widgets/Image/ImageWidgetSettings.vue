<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { v4 } from "uuid";
import { ref, onMounted, type Ref } from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { CollapseState, ImageSharingComponentProps } from "@/@types/widgets";
import type { Store } from "@/stores/Widgets/Store";

const props = defineProps(["component"]) as ImageSharingComponentProps;
const opened: Ref<CollapseState> = ref({
  imageSection: false,
  storeSection: false,
});

const storeManager = useStoreManager();
let stores: Ref<any[]> = ref([]) as Ref<any[]>;
const requestResult: Ref<string> = ref("");
const storeId: Ref<string> = ref(props.component.storeId);

const addNew = () => {
  console.log(props.component);
  props.component.images?.push({
    id: v4(),
    url: "Test",
  });
};

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
  <va-collapse v-model="opened.imageSection" header="Image widget settings">
    <div class="settings-container">
      <va-button @click="addNew">Add image</va-button>
      <div class="image-list-container">
        <div
          v-for="(image, index) in props.component.images"
          :key="image.id"
          class="image-settings-container"
        >
          <va-input
            v-model="image.url"
            label="Image src"
            class="image-settings-remove-input"
          />
          <va-button
            @click="() => props.component.images.splice(index, 1)"
            icon="clear"
            class="image-settings-remove-button"
          />
          <!-- {{ image.url }} -->
        </div>
      </div>
      <va-select
        v-model="props.component.imageSettings.fit"
        label="Fit"
        :options="['Cover', 'Contain', 'Stretch', 'Fill', 'None']"
      >
      </va-select>
      <va-input
        v-model="props.component.imageSettings.diashowInterval"
        label="Diashow interval"
      >
      </va-input>
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
.image-settings-container {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 1rem;
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.image-settings-remove-button {
  margin-bottom: 0.25rem;
}

.image-settings-remove-input {
  flex-grow: 1;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-list-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 500px;
  overflow: auto;
  padding: 0.5rem;
  background-color: #eee;
  border-radius: 0.5rem;
}
</style>
