<script lang="ts" setup>
import { useStoreManager } from "../../composables/storeManager";
import { ref, watch } from "vue";

const storeManager = useStoreManager();
const map = storeManager.getStoreList();
const list = ref([]);

watch(
  map,
  () => {
    list.value = Array.from(map.value, function (entry) {
      return entry[1];
    });
  },
  { deep: true },
);
</script>

<template>
  <va-list>
    <va-list-label> Stores </va-list-label>
    <template v-if="list.length">
      <va-list-item
        v-for="(item, index) in list"
        :key="index"
        class="list__item"
      >
        <va-list-item-section>
          <va-list-item-label>
            {{ item.caption }}
          </va-list-item-label>
        </va-list-item-section>
      </va-list-item>
    </template>
    <template v-else> No datasource available </template>
  </va-list>
</template>

<style scoped>
.list__item {
  padding: 0.5rem;
  border: 1px solid silver;
}
</style>
