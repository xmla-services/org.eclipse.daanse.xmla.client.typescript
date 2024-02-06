<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { usePromisifiedModal } from "@/composables/promisifiedModal";
import { ref, watch, markRaw, nextTick } from "vue";
import DatasourceList from "@/components/Datasources/DatasourceList.vue";
import { useDatasourceManager } from "../../composables/datasourceManager";

const field = ref("");
const options = [];
const requestResult = ref("");
const dsManager = useDatasourceManager();
const map = dsManager.getDatasourceList();
const list = ref([]);
const showCreateNew = ref(false);
const datasource_type = ref("");
const datasource_caption = ref("");
const datasource_url = ref("");

const selectedItems = ref([]);
const selectMode = "single";
const selectedColor = "primary";

watch(
  map,
  () => {
    list.value = Array.from(map.value, function (entry) {
      return entry[1];
    });
    console.log(list.value);
  },
  { deep: true },
);

const reset = () => {
  field.value = "";
};

const { isOpened, run, close } = usePromisifiedModal(reset);

const ok = () => {
  console.log(selectedItems.value);
  close(selectedItems.value);
};

const onKeyPress = (e) => {
  if (e.key === "Enter") {
    ok();
  }
};

watch(isOpened, () => {
  if (isOpened.value) {
    window.addEventListener("keypress", onKeyPress);
  } else {
    window.removeEventListener("keypress", onKeyPress);
  }
});

const createNewDatasource = async () => {
  const datasourceId = dsManager.initStore(
    datasource_type.value,
    datasource_url.value,
    datasource_caption.value,
  );
  await nextTick();

  const datasource = map.value.get(datasourceId);
  selectedItems.value.push(datasource);
  showCreateNew.value = false;
};

const columns = [
  { key: "caption", sortable: false },
  { key: "url", sortable: false },
  // { key: "name", sortable: true },
  // { key: "email", sortable: true },
  // { key: "phone", sortable: true },
];

defineExpose({
  run,
  close,
});
</script>
<template>
  <va-modal
    :modelValue="isOpened"
    no-padding
    class="field-selection-modal"
    @ok="ok"
  >
    <template #content="{ ok }">
      <va-card-title class="va-h6">Datasource selection:</va-card-title>
      <va-card-content>
        <template v-if="showCreateNew">
          <div class="mt-4 mb-4">
            <div class="mb-2">
              <va-input
                v-model="datasource_caption"
                type="text"
                label="Datasource caption"
              />
            </div>
            <div class="mb-2">
              <va-select
                :options="['REST', 'XMLA','MQTT']"
                v-model="datasource_type"
                label="Datasource type"
              />
            </div>
            <div>
              <va-input
                v-model="datasource_url"
                type="text"
                label="Datasource URL"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <va-button @click="showCreateNew = true">Add new</va-button>
          <div v-if="showCreateNew" class="mt-4 mb-4">
            <div class="mb-2">
              <va-input
                v-model="datasource_caption"
                type="text"
                label="Datasource caption"
              />
            </div>
            <div>
              <va-select
                :options="['REST', 'XMLA','MQTT']"
                v-model="datasource_type"
                label="Datasource type"
              />
            </div>
          </div>
          <va-data-table
            v-model="selectedItems"
            :items="list"
            :columns="columns"
            selectable
            :select-mode="selectMode"
            :selected-color="selectedColor"
          />
        </template>
      </va-card-content>
      <va-card-actions v-if="!showCreateNew">
        <va-button @click="ok" :disabled="!selectedItems.length">Ok!</va-button>
      </va-card-actions>
      <va-card-actions v-else>
        <va-button @click="createNewDatasource" class="mr-2">Create</va-button>
        <va-button @click="showCreateNew = false" preset="primary"
          >Cancel</va-button
        >
      </va-card-actions>
    </template>
  </va-modal>
</template>
<style lang="scss">
.field-selection-modal {
  .va-modal__container {
    width: 100%;
  }

  .response {
    background-color: lightgrey;
    padding: 0.5rem;
    border-radius: 4px;
  }

  .input {
    width: 100%;
  }

  .va-modal__dialog {
    margin: auto;
  }
}
</style>
