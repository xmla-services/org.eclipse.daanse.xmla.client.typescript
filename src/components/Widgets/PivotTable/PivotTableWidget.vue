<script lang="ts" setup>
import PivotTable from "@/components/PivotTable/PivotTable.vue";
import { onBeforeMount, ref } from "vue";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { usePivotTableStore } from "@/stores/PivotTable";
import { storeToRefs } from "pinia";

const inited = ref(false);

const sampleMdx = `
SELECT
Hierarchize(AddCalculatedMembers({[Store].[(All)].members})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME,[Store].[Store Name].[Store Type],[Store].[Store Name].[Store Manager],[Store].[Store Name].[Store Sqft],[Store].[Store Name].[Grocery Sqft],[Store].[Store Name].[Frozen Sqft],[Store].[Store Name].[Meat Sqft],[Store].[Store Name].[Has coffee bar],[Store].[Store Name].[Street address] ON 1,

Hierarchize(AddCalculatedMembers({[Gender].[(All)].members})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME ON 0
FROM [Sales] CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS
`;

onBeforeMount(async () => {
  const url = 'http://localhost:7770/emondrian/xmla';
  const cubeName = 'Sales';
  const catalogName = 'FoodMart';

  const appSettings = useAppSettingsStore();
  await appSettings.initXmlaApi(url);
  const pivotTableStore = usePivotTableStore();

  appSettings.openCube(catalogName, cubeName);
  const { state } = storeToRefs(pivotTableStore);
  state.value.staticMdx = sampleMdx;
  state.value.isStatic = true;
  console.log(pivotTableStore);
  inited.value = true;
});
</script>

<template>
  <template v-if="inited">
    <PivotTable></PivotTable>
  </template>
</template>
