import { defineStore } from "pinia";
import { useAppSettingsStore } from "./AppSettings";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";
import { ref, watch } from "vue";
import { useTreeViewDataStore } from "./TreeView";
import { getMdxRequest } from "@/utils/MdxRequests/MdxRequestConstructor";

export const usePivotTableStore = defineStore("PivotTable", () => {
  const queryDesignerStore = useQueryDesignerStore();
  const appSettings = useAppSettingsStore();
  const treeViewStore = useTreeViewDataStore();

  const state = ref({
    settings: ref({
      showEmpty: true,
    }),
    styles: {
      rows: [] as number[],
      columns: [],
    },
    rowsDrilldownMembers: [] as any,
    columnsDrilldownMembers: [] as any,
    inited: false,
  });

  const mdx = ref("");

  function getMDX() {
    const rows = queryDesignerStore.rows;
    const columns = queryDesignerStore.columns;
    const pivotTableSettings = state.value.settings;

    const mdxRequest = getMdxRequest(
      appSettings.selectedCube,
      state.value.rowsDrilldownMembers,
      state.value.columnsDrilldownMembers,
      rows,
      columns,
      pivotTableSettings,
      treeViewStore.properties
    );

    mdx.value = mdxRequest;
  }

  const fetchPivotTableData = () => {
    getMDX();
  };

  const drilldownOnRows = (member: any) => {
    const sameHierarchyIndex = state.value.rowsDrilldownMembers.findIndex(
      (e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      }
    );
    if (sameHierarchyIndex >= 0) {
      state.value.rowsDrilldownMembers.splice(sameHierarchyIndex, 1, member);
    } else {
      state.value.rowsDrilldownMembers.push(member);
    }
  };
  const drilldownOnColumns = (member: any) => {
    const sameHierarchyIndex = state.value.columnsDrilldownMembers.findIndex(
      (e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      }
    );
    if (sameHierarchyIndex >= 0) {
      state.value.columnsDrilldownMembers.splice(sameHierarchyIndex, 1, member);
    } else {
      state.value.columnsDrilldownMembers.push(member);
    }
  };

  const flushDrilldowns = () => {
    const columns = queryDesignerStore.columns;
    const notUsedHierarchiesInDrilldownCols =
      state.value.columnsDrilldownMembers.filter((e: any) => {
        return !columns.some((member) => {
          return (
            member.originalItem.HIERARCHY_UNIQUE_NAME ===
            e.HIERARCHY_UNIQUE_NAME
          );
        });
      });

    notUsedHierarchiesInDrilldownCols.forEach((member: any) => {
      const itemIndex = state.value.columnsDrilldownMembers.findIndex(
        (e: any) => {
          return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
        }
      );

      state.value.columnsDrilldownMembers.splice(itemIndex, 1);
    });

    const rows = queryDesignerStore.rows;
    const notUsedHierarchiesInDrilldownRows =
      state.value.rowsDrilldownMembers.filter((e: any) => {
        return !rows.some((member) => {
          return (
            member.originalItem.HIERARCHY_UNIQUE_NAME ===
            e.HIERARCHY_UNIQUE_NAME
          );
        });
      });

    notUsedHierarchiesInDrilldownRows.forEach((member: any) => {
      const itemIndex = state.value.rowsDrilldownMembers.findIndex((e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      });

      state.value.rowsDrilldownMembers.splice(itemIndex, 1);
    });
  };

  queryDesignerStore.$subscribe(
    () => {
      flushDrilldowns();
      fetchPivotTableData();
    },
    { detached: true, immediate: false }
  );

  watch(
    state.value.settings,
    () => {
      fetchPivotTableData();
    },
    { deep: true }
  );

  watch(
    state.value.rowsDrilldownMembers,
    () => {
      fetchPivotTableData();
    },
    { deep: true }
  );
  watch(
    state.value.columnsDrilldownMembers,
    () => {
      fetchPivotTableData();
    },
    { deep: true }
  );

  return {
    state,
    fetchPivotTableData,
    drilldownOnRows,
    drilldownOnColumns,
    mdx,
  };
});
