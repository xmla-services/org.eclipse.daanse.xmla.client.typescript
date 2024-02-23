<script lang="ts" setup>
import { useStoreManager } from "../../../composables/storeManager";
import { useDatasourceManager } from "../../../composables/datasourceManager";
import { onMounted, ref, watch } from "vue";

const storeManager = useStoreManager();
const dslist = ref([]);
const selectedDatasources = ref([]);

const catalogs = ref([]);
const selectedCatalog = ref({});

const cubes = ref([]);
const selectedCube = ref({});

const hierarchies = ref([]);
const selectedRow = ref({});
const selectedCol = ref({});

const measures = ref([]);
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
    console.log(dsmap.value);
    dslist.value = Object.entries(dsmap.value).map((entry) => {
      return entry[1];
    });
  },
  { deep: true },
);

onMounted(() => {
  dslist.value = Array.from(dsmap.value, function (entry) {
    console.log(entry[1]);
    return { ...entry[1] };
  });
});

const saveStore = (item) => {
  const store = storeManager.getStore(item.id);
  console.log(store);
  store.setOptions({
    caption: item.caption,
  });
};

const createDatasource = () => {
  dsManager.initDatasource("REST", "", "");
};

const updateDatasource = (index, type) => {
  const datasourceToUpdate = dslist.value[index];
  if (datasourceToUpdate) {
    if (datasourceToUpdate.type !== type) {
      console.log(datasourceToUpdate, type);
      dsManager.updateDatasource(
        datasourceToUpdate.id,
        type,
        datasourceToUpdate.caption,
        datasourceToUpdate.url,
      );
    }
  }
};

const setSelectedDatasources = (id, currentSelectedItems) => {
  console.log(currentSelectedItems);
  const ids = currentSelectedItems.map((e) => e.id);
  const store = storeManager.getStore(id);
  store.setDatasources(ids);

  getCatalogs();
};

const getSelectedDatasources = (item) => {
  const store = storeManager.getStore(item.id);
  const selectedDatasources = store.datasourceIds;

  return dslist.value.filter((e) => {
    return selectedDatasources.includes(e.id);
  });
};

const getCatalogs = async () => {
  const selectedDatasource = getSelectedDatasources(props.item)[0];
  catalogs.value = (await selectedDatasource.getCatalogs()).catalogs;
  console.log(catalogs.value);
};

const getCubes = async () => {
  const selectedDatasource = getSelectedDatasources(props.item)[0];
  cubes.value = (
    await selectedDatasource.getCubes(selectedCatalog.value.CATALOG_NAME)
  ).cubes;
  console.log(cubes);
};

const getMetadata = async () => {
  const selectedDatasource = getSelectedDatasources(props.item)[0];
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
    col: value,
  });
};

const setMeasure = async (value) => {
  const store = storeManager.getStore(props.item.id);
  store.setOptions({
    measure: value,
  });
};
</script>

<template>
  <div class="store-item-header" @click="clickHeader">
    <va-list-item-label class="store-item-header-text">
      {{ item.caption }} {{ item.id }}
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
        :columns="[{ key: 'caption' }, { key: 'type' }, { key: 'url' }]"
        :model-value="getSelectedDatasources(item)"
        selectable
        select-mode="single"
        @update:model-value="setSelectedDatasources(item.id, $event)"
      >
        <template #cell(caption)="{ rowIndex }">
          <va-input
            class="caption-input"
            @blur="updateDatasource(rowIndex)"
            v-model="dslist[rowIndex].caption"
          ></va-input>
        </template>
        <template #cell(type)="{ rowIndex }">
          <va-select
            class="type-input"
            :model-value="dslist[rowIndex].type"
            @update:modelValue="updateDatasource(rowIndex, $event)"
            :options="['REST', 'XMLA']"
          />
        </template>
        <template #cell(url)="{ rowIndex }">
          <va-input
            class="url-input"
            @blur="updateDatasource(rowIndex)"
            v-model="dslist[rowIndex].url"
          ></va-input>
        </template>
      </va-data-table>
      <template v-if="getSelectedDatasources(item).length">
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
