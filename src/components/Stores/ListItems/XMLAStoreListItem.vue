<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { useStoreManager } from "../../../composables/storeManager";
import { useDatasourceManager } from "../../../composables/datasourceManager";
import { onMounted, ref, watch, nextTick, onActivated } from "vue";
import type XMLADatasource from "@/dataSources/XmlaDatasource";

const storeManager = useStoreManager();
const dslist = ref([] as XMLADatasource[]);

const catalogs = ref([] as DBSchemaCatalog[]);
const selectedCatalog = ref({} as DBSchemaCatalog);

const cubes = ref([] as MDSchemaCube[]);
const selectedCube = ref({} as MDSchemaCube);

const hierarchies = ref([] as MDSchemaHierarchy[]);
const selectedRow = ref({});
const selectedCol = ref({});

const measures = ref([] as MDSchemaMeasure[]);
const selectedMeasure = ref({});

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const item = ref(props.item);
const isExpanded = ref(false);

const dsManager = useDatasourceManager();
const dsmap = dsManager.getDatasourceList();

const clickHeader = () => {
  isExpanded.value = !isExpanded.value;
};

watch(
  dsmap,
  () => {
    dslist.value = Object.entries(dsmap.value)
      .map((entry) => {
        return entry[1];
      })
      .filter((e) => e.type === "XMLA") as XMLADatasource[];
  },
  { deep: true },
);

onActivated(() => {
  dslist.value = Object.entries(dsmap.value).map((entry) => {
    return entry[1];
  }) as XMLADatasource[];
});

onMounted(async () => {
  selectedRow.value = item.value.row || {};
  selectedCol.value = item.value.column || {};
  selectedMeasure.value = item.value.measure || {};
  dslist.value = Object.entries(dsmap.value).map((entry) => {
    return entry[1];
  }) as XMLADatasource[];

  const ds = getSelectedDatasource();
  selectedCatalog.value = ds?.catalog || {
    CATALOG_NAME: "",
    DESCRIPTION: "",
  };
  selectedCube.value = ds?.cube || {
    CUBE_NAME: "",
    CUBE_CAPTION: "",
  };

  await getCatalogs();

  if (selectedCatalog.value.CATALOG_NAME) {
    await getCubes();
  }
  if (selectedCube.value.CUBE_NAME) {
    await getMetadata();
  }
});

const saveStore = (item) => {
  const store = storeManager.getStore(item.id);
  store.setOptions({
    caption: item.caption,
  });
};

const createDatasource = () => {
  dsManager.initDatasource("XMLA", "", "");
};

const updateDatasource = (index, type) => {
  const datasourceToUpdate = dslist.value[index] as XMLADatasource;
  if (datasourceToUpdate) {
    if (datasourceToUpdate.type !== type) {
      dsManager.updateDatasource(
        datasourceToUpdate.id,
        type,
        datasourceToUpdate.caption,
        datasourceToUpdate.url,
      );
    }
  }
};

const setSelectedDatasource = (id, currentSelectedItems) => {
  const ids = currentSelectedItems.map((e) => e.id);
  const store = storeManager.getStore(id);
  store.setDatasource(ids[0]);

  getCatalogs();
};

const getSelectedDatasource = (): XMLADatasource => {
  const store = storeManager.getStore(item.value.id);
  const selectedDatasource = store.datasourceId;

  return dslist.value.find((e) => {
    return selectedDatasource === e.id;
  }) as XMLADatasource;
};

const getCatalogs = async () => {
  const selectedDatasource = getSelectedDatasource();
  if (!selectedDatasource) {
    return;
  }

  catalogs.value = await selectedDatasource.getCatalogs();
};

const getCubes = async () => {
  const selectedDatasource = getSelectedDatasource();

  if (!selectedDatasource || !selectedCatalog.value) {
    return;
  }

  selectedDatasource.setCatalog(selectedCatalog.value);

  cubes.value = await selectedDatasource.getCubes(
    selectedCatalog.value.CATALOG_NAME,
  );
};

const getMetadata = async () => {
  const selectedDatasource = getSelectedDatasource();

  if (!selectedDatasource || !selectedCube.value) {
    return;
  }

  selectedDatasource.setCube(selectedCube.value);
  await selectedDatasource.openCube(
    selectedCatalog.value.CATALOG_NAME,
    selectedCube.value.CUBE_NAME,
  );

  hierarchies.value = await selectedDatasource.getHierarchies();
  measures.value = await selectedDatasource.getMeasures();
};

const setRowHierarchy = async (value) => {
  const store = storeManager.getStore(props.item.id);
  store.setOptions({
    row: value,
  });
};

const setColHierarchy = async (value) => {
  const store = storeManager.getStore(props.item.id);
  store.setOptions({
    column: value,
  });
};

const setMeasure = async (value) => {
  const store = storeManager.getStore(props.item.id);
  store.setOptions({
    measure: value,
  });
  await nextTick();
  await store.getData();
};
</script>

<template>
  <div class="store-item-header" @click="clickHeader">
    <va-list-item-label class="store-item-header-text">
      {{ item.caption }}
      <!-- {{ item.id }} -->
    </va-list-item-label>
    <va-icon v-if="!isExpanded" class="material-icons"> expand_more </va-icon>
    <va-icon v-else class="material-icons"> expand_less </va-icon>
  </div>
  <div v-if="isExpanded" class="store-item-content">
    <va-input
      label="Caption"
      v-model="item.caption"
      @blur="saveStore(item)"
    ></va-input>

    <div class="datasource-list">
      <h2>Datasources</h2>
      <va-button class="datasource-list-add-button" @click="createDatasource">
        Add datasource
      </va-button>
      <va-data-table
        class="table-crud"
        :items="dslist"
        :columns="[{ key: 'caption' }, { key: 'url' }]"
        :model-value="[getSelectedDatasource()]"
        selectable
        select-mode="single"
        @update:model-value="setSelectedDatasource(item.id, $event)"
      >
        <template #cell(caption)="{ rowIndex }">
          <va-input
            class="caption-input"
            @blur="updateDatasource(rowIndex, null)"
            v-model="dslist[rowIndex].caption"
          ></va-input>
        </template>
        <!-- <template #cell(type)="{ rowIndex }">
          <va-select
            class="type-input"
            :model-value="dslist[rowIndex].type"
            @update:modelValue="updateDatasource(rowIndex, $event)"
            :options="['REST', 'XMLA']"
          />
        </template> -->
        <template #cell(url)="{ rowIndex }">
          <va-input
            class="url-input"
            @blur="updateDatasource(rowIndex, null)"
            v-model="dslist[rowIndex].url"
          ></va-input>
        </template>
      </va-data-table>
      <template v-if="getSelectedDatasource()">
        <h2 class="mt-3">Catalog:</h2>
        <va-select
          text-by="CATALOG_NAME"
          v-model="selectedCatalog"
          @update:modelValue="getCubes"
          :options="catalogs"
        />
        <template v-if="Object.keys(selectedCatalog).length">
          <h2 class="mt-3">Cube:</h2>
          <va-select
            text-by="CUBE_NAME"
            v-model="selectedCube"
            @update:modelValue="getMetadata"
            :options="cubes"
          />
        </template>
        <template v-if="Object.keys(selectedCube).length">
          <h2 class="mt-3">Rows hierarchy:</h2>
          <va-select
            :options="hierarchies"
            text-by="HIERARCHY_NAME"
            @update:modelValue="setRowHierarchy"
            v-model="selectedRow"
          />
          <h2 class="mt-3">Cols hierarchy:</h2>
          <va-select
            :options="hierarchies"
            text-by="HIERARCHY_NAME"
            @update:modelValue="setColHierarchy"
            v-model="selectedCol"
          />
          <h2 class="mt-3">Measure:</h2>
          <va-select
            :options="measures"
            text-by="MEASURE_NAME"
            @update:modelValue="setMeasure"
            v-model="selectedMeasure"
          />
        </template>
      </template>
    </div>
  </div>
</template>
