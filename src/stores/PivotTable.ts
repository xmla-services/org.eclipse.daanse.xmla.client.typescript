import { defineStore } from "pinia";
import { useAppSettingsStore } from "./AppSettings";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";

export const usePivotTableStore = defineStore("PivotTable", {
  state: () => {
    return {
      rows: [],
      columns: [],
      cells: [],
    };
  },
  actions: {
    async fetchPivotTableData() {
      const appSettings = useAppSettingsStore();
      const queryDesignerStore = useQueryDesignerStore();

      const api = appSettings.getApi();
      const rows = queryDesignerStore.rows;
      const columns = queryDesignerStore.columns;

      const [tableData] = await Promise.all([
        await api.getPivotTableData(appSettings.selectedCube, rows, columns),
      ]);

      this.rows = tableData.axis0;
      this.columns = tableData.axis1;
      this.cells = tableData.cells;
      console.log(tableData);
      // this.tableData = tableData;
    },
  },
});
