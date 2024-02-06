<script lang="ts" setup>
import { useStoreManager } from "../../composables/storeManager";
import { useDatasourceManager } from "../../composables/datasourceManager";
import { computed, onMounted, ref, watch } from "vue";

const storeManager = useStoreManager();
const map = storeManager.getStoreList();
const list = ref([]);
const dslist = ref([]);
const expandedItem = ref("");
const selectedDatasources = ref([]);

const dsManager = useDatasourceManager();
const dsmap = dsManager.getDatasourceList();

const isExpanded = (id) => {
  return expandedItem.value === id;
};

const clickHeader = (id) => {
  if (expandedItem.value === id) {
    expandedItem.value = "";
  } else {
    expandedItem.value = id;
  }
};

watch(
  map,
  () => {
    list.value = Array.from(map.value, function (entry) {
      return { ...entry[1] };
    });
  },
  { deep: true },
);

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
  list.value = Array.from(map.value, function (entry) {
    return { ...entry[1] };
  });

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
}
</script>

<template>
  <va-list>
    <template v-if="list.length">
      <div v-for="(item, index) in list" :key="index" class="store-item">
        <div class="store-item-header" @click="clickHeader(item.id)">
          <va-list-item-label class="store-item-header-text">
            {{ item.caption }} {{ item.id }}
          </va-list-item-label>
          <va-icon v-if="!isExpanded(item.id)" class="material-icons">
            expand_more
          </va-icon>
          <va-icon v-else class="material-icons"> expand_less </va-icon>
        </div>
        <div v-if="isExpanded(item.id)" class="store-item-content">
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
            <va-button
              class="datasource-list-add-button"
              @click="createDatasource"
            >
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
                  :options="['REST', 'XMLA','MQTT']"
                >



                </va-select>

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
                    id="ad"
                  class="url-input"
                  :model-value="getParams(item)[rowIndex].value"
                  @update:model-value="setParamValue(item, rowIndex, $event)"

                />

              </template>
            </va-data-table>
          </div>

          <div class="datasource-list">
            <h2>Events</h2>
            <va-button
              class="datasource-list-add-button"
              @click="addEvent(item.id)"
            >
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
      </div>
    </template>
    <template v-else> No stores available </template>
  </va-list>
</template>

<style>
.datasource-list {
  padding-top: 20px;
  margin-top: 8px;
  border-top: 1px solid silver;
}

.datasource-list > h2 {
  margin-bottom: 8px;
}

.datasource-list-add-button {
  margin-bottom: 0.5rem;
}

.store-item {
  padding: 0;
  border: 1px solid silver;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
}

.store-item-header {
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.store-item-header-text {
  width: 100%;
  font-size: 18px;
  font-weight: 600;
}

.store-item-content {
  padding: 0.75rem;
  border-top: 1px solid silver;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.caption-input {
  width: 90px;
}

.type-input {
  width: 80px;
  z-index: 10000;
}

.url-input {
  width: 170px;
}

.event-name-input {
  width: 120px;
}

.event-action-input {
  width: 230px;
}
.va-dropdown__content.va-select-dropdown__content.va-dropdown__content-wrapper{
  z-index:1000000!important;
}
</style>
