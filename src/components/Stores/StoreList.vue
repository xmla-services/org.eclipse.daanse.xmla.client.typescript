<script lang="ts" setup>
import { useStoreManager } from "../../composables/storeManager";
import { onMounted, ref, watch } from "vue";
import StoreListItem from "./ListItems/StoreListItem.vue";
import XMLAStoreListItem from "./ListItems/XMLAStoreListItem.vue";

const storeManager = useStoreManager();
const map = storeManager.getStoreList();
const list = ref([]);

watch(
  map,
  () => {
    list.value = Array.from(map.value, function (entry) {
      return { ...entry[1] };
    });
  },
  { deep: true },
);

onMounted(() => {
  list.value = Array.from(map.value, function (entry) {
    return { ...entry[1] };
  });
});
</script>

<template>
  <va-list>
    <template v-if="list.length">
      <div v-for="(item, index) in list" :key="index" class="store-item">
        <template v-if="item.type === 'REST'">
          <store-list-item :item="item"></store-list-item>
        </template>
        <template v-else-if="item.type === 'XMLA'">
          <XMLAStoreListItem :item="item"></XMLAStoreListItem>
        </template>
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
  z-index: 1000000;
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
</style>
