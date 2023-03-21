import { defineStore } from "pinia";
import { useAppSettingsStore } from "./AppSettings";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";
import { ref, watch } from "vue";
import { useTreeViewDataStore } from "./TreeView";

export const usePivotTableStore = defineStore("PivotTable", () => {
  const state = ref({
    rows: [],
    columns: [],
    cells: [],
    rowsStyles: [],
    columnStyles: [],
    settings: ref({
      showEmpty: true,
    }),
    inited: false,
  });

  const fetchPivotTableData = async () => {
    const appSettings = useAppSettingsStore();
    const queryDesignerStore = useQueryDesignerStore();
    const treeViewStore = useTreeViewDataStore();

    const api = appSettings.getApi();
    const rows = queryDesignerStore.rows;
    const columns = queryDesignerStore.columns;
    const pivotTableSettings = state.value.settings;

    appSettings.loading = true;
    const [tableData] = await Promise.all([
      await api.getPivotTableData(
        appSettings.selectedCube,
        rows,
        columns,
        pivotTableSettings,
        treeViewStore.properties
      ),
    ]);

    state.value.rows = tableData.axis0;
    state.value.columns = tableData.axis1;
    state.value.cells = tableData.cells;

    appSettings.loading = false;
  };

  const queryDesignerStore = useQueryDesignerStore();
  queryDesignerStore.$subscribe(
    () => {
      fetchPivotTableData();
    },
    { detached: true, immediate: false }
  );

  watch(
    state.value.settings,
    async () => {
      await fetchPivotTableData();
    },
    { deep: true }
  );

  return {
    state,
    fetchPivotTableData,
  };
});
