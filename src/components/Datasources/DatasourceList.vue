<script lang="ts" setup>
import { useDatasourceManager } from "../../composables/datasourceManager";
import { ref, watch } from "vue";

const items = ref(["Item 1", "Item 2", "Item 3", "Item 4"]);

const dsManager = useDatasourceManager();
const map = dsManager.getDatasourceList();
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
    <va-list-label> Datasources </va-list-label>
    <template v-if="list.length">
      <va-list-item
        v-for="(item, index) in list"
        :key="index"
        class="list__item"
      >
        <va-list-item-section>
          <va-list-item-label>
            {{ item.type }}
          </va-list-item-label>
          <va-list-item-label>
            {{ item.url }}
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
