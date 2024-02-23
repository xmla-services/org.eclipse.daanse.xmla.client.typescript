<script lang="ts" setup>
import { useStoreManager } from "../../../composables/storeManager";
import { useDatasourceManager } from "../../../composables/datasourceManager";
import { onMounted, ref, watch } from "vue";

const storeManager = useStoreManager();
const dslist = ref([]);
const selectedDatasources = ref([]);

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
    dslist.value = Array.from(dsmap.value, function (entry) {
      console.log(entry[1]);
      return { ...entry[1] };
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
    requestTemplate: item.requestTemplate,
  });
};

const createDatasource = () => {
  dsManager.initDatasource("REST", "", "");
};

const updateDatasource = (index) => {
  const datasourceToUpdate = dslist.value[index];
  const ds = dsManager.getDatasource(datasourceToUpdate.id);
  if (ds) {
    ds.caption = datasourceToUpdate.caption;
    ds.url = datasourceToUpdate.url;

    if (ds.type !== datasourceToUpdate.type) {
      dsManager.updateDatasource(
        datasourceToUpdate.id,
        datasourceToUpdate.type,
        datasourceToUpdate.caption,
        datasourceToUpdate.url,
      );
    }
  }
};

const addEvent = (id) => {
  const store = storeManager.getStore(id);
  store.events.push({
    name: "",
    action: "",
  });
};

const setSelectedDatasources = (id, currentSelectedItems) => {
  console.log(currentSelectedItems);
  const ids = currentSelectedItems.map((e) => e.id);
  const store = storeManager.getStore(id);
  store.setDatasources(ids);
};

const updateEvents = (item) => {
  const store = storeManager.getStore(item.id);
  store.updateEvents(item.events);
};

const getParams = (item) => {
  const params = Object.entries(item.params).map((e) => ({
    name: e[0],
    value: e[1],
  }));

  return params;
};

const setParamValue = (item, index, value) => {
  const store = storeManager.getStore(item.id);
  const paramName = getParams(item)[index].name;

  store.updateParam(paramName, value);
  console.log(paramName, value);
};

const getSelectedDatasources = (item) => {
  const store = storeManager.getStore(item.id);
  const selectedDatasources = store.datasourceIds;

  return dslist.value.filter((e) => {
    return selectedDatasources.includes(e.id);
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
    <va-input
      label="Data endpoint"
      v-model="item.requestTemplate"
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
            v-model="dslist[rowIndex].type"
            @update:modelValue="updateDatasource(rowIndex)"
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
    </div>

    <div class="datasource-list">
      <h2>Params</h2>
      <va-data-table
        class="table-crud"
        :items="getParams(item)"
        :columns="[{ key: 'name' }, { key: 'value' }]"
      >
        <template #cell(value)="{ rowIndex }">
          <va-input
            class="url-input"
            :model-value="getParams(item)[rowIndex].value"
            @update:model-value="setParamValue(item, rowIndex, $event)"
          ></va-input>
        </template>
      </va-data-table>
    </div>

    <div class="datasource-list">
      <h2>Events</h2>
      <va-button class="datasource-list-add-button" @click="addEvent(item.id)">
        Add event
      </va-button>
      <va-data-table
        class="table-crud"
        :items="item.events"
        :columns="[{ key: 'name' }, { key: 'action' }]"
      >
        <template #cell(name)="{ rowIndex }">
          <va-input
            class="event-name-input"
            @blur="updateEvents(item)"
            v-model="item.events[rowIndex].name"
          ></va-input>
        </template>
        <template #cell(action)="{ rowIndex }">
          <va-input
            class="event-action-input"
            @blur="updateEvents(item)"
            v-model="item.events[rowIndex].action"
          />
        </template>
      </va-data-table>
    </div>
  </div>
</template>
