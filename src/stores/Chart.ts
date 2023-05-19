/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { defineStore } from "pinia";
import { useAppSettingsStore } from "./AppSettings";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";
import { ref, watch } from "vue";
import { useTreeViewDataStore } from "./TreeView";
import { getMdxRequest } from "@/utils/MdxRequests/MdxRequestConstructor";

export const useChartStore = defineStore("Chart", () => {
  const queryDesignerStore = useQueryDesignerStore();
  const appSettings = useAppSettingsStore();
  const treeViewStore = useTreeViewDataStore();

  const state = ref({
    settings: ref({
      showEmpty: true,
      alignContent: "right",
    }),
    rowsDrilldownMembers: [] as any,
    columnsDrilldownMembers: [] as any,
    rowsExpandedMembers: [] as any,
    columnsExpandedMembers: [] as any,
    inited: false,
  });

  const mdx = ref("");

  async function getMDX() {
    const rows = queryDesignerStore.rows;
    const columns = queryDesignerStore.columns;
    const measures = queryDesignerStore.measures;
    const settings = state.value.settings;
    const filters = queryDesignerStore.filters;

    const mdxRequest = await getMdxRequest(
      appSettings.selectedCube,
      state.value.rowsDrilldownMembers,
      state.value.columnsDrilldownMembers,
      state.value.rowsExpandedMembers,
      state.value.columnsExpandedMembers,
      rows,
      columns,
      measures,
      settings,
      treeViewStore.properties,
      filters
    );

    mdx.value = mdxRequest;
  }

  const fetchPivotTableData = () => {
    getMDX();
  };

  const drilldownOnRows = (member: any) => {
    const expandedIndex = state.value.rowsExpandedMembers.findIndex(
      (e: any) => e.UName === member.UName
    );
    if (expandedIndex >= 0)
      state.value.rowsExpandedMembers.splice(expandedIndex, 1);

    const sameHierarchyIndex = state.value.rowsDrilldownMembers.findIndex(
      (e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      }
    );
    if (member.LNum === "0") {
      state.value.rowsDrilldownMembers.splice(sameHierarchyIndex, 1);
    } else {
      if (sameHierarchyIndex >= 0) {
        state.value.rowsDrilldownMembers.splice(sameHierarchyIndex, 1, member);
      } else {
        state.value.rowsDrilldownMembers.push(member);
      }
    }
  };
  const drilldownOnColumns = (member: any) => {
    const expandedIndex = state.value.columnsExpandedMembers.findIndex(
      (e: any) => e.UName === member.UName
    );
    if (expandedIndex >= 0)
      state.value.columnsExpandedMembers.splice(expandedIndex, 1);

    const sameHierarchyIndex = state.value.columnsDrilldownMembers.findIndex(
      (e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      }
    );
    if (member.LNum === "0") {
      state.value.columnsDrilldownMembers.splice(sameHierarchyIndex, 1);
    } else {
      if (sameHierarchyIndex >= 0) {
        state.value.columnsDrilldownMembers.splice(
          sameHierarchyIndex,
          1,
          member
        );
      } else {
        state.value.columnsDrilldownMembers.push(member);
      }
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

  const expandOnRows = (member: any) => {
    const currentMemberHierarchyItems: any[] =
      state.value.rowsExpandedMembers.filter((e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      });
    currentMemberHierarchyItems.push(member);
    currentMemberHierarchyItems.sort(
      (a, b) => parseInt(a.LNum) - parseInt(b.LNum)
    );
    const indexInSorted = currentMemberHierarchyItems.indexOf(member);
    if (indexInSorted === 0) {
      if (currentMemberHierarchyItems.length > 1) {
        const nextItemIndex = state.value.rowsExpandedMembers.findIndex(
          (e) => e.UName === currentMemberHierarchyItems[1].UName
        );
        state.value.rowsExpandedMembers.splice(nextItemIndex, 0, member);
      } else {
        state.value.rowsExpandedMembers.push(member);
      }
    } else {
      const prevItemIndex = state.value.rowsExpandedMembers.findIndex(
        (e) => e.UName === currentMemberHierarchyItems[indexInSorted - 1].UName
      );
      state.value.rowsExpandedMembers.splice(prevItemIndex + 1, 0, member);
    }
  };
  const collapseOnRows = (member: any) => {
    const itemIndex = state.value.rowsExpandedMembers.findIndex((e: any) => {
      return e.UName === member.UName;
    });

    state.value.rowsExpandedMembers.splice(itemIndex, 1);
  };

  const expandOnColumns = (member: any) => {
    const currentMemberHierarchyItems: any[] =
      state.value.columnsExpandedMembers.filter((e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      });
    currentMemberHierarchyItems.push(member);
    currentMemberHierarchyItems.sort(
      (a, b) => parseInt(a.LNum) - parseInt(b.LNum)
    );
    const indexInSorted = currentMemberHierarchyItems.indexOf(member);
    if (indexInSorted === 0) {
      if (currentMemberHierarchyItems.length > 1) {
        const nextItemIndex = state.value.columnsExpandedMembers.findIndex(
          (e) => e.UName === currentMemberHierarchyItems[1].UName
        );
        state.value.columnsExpandedMembers.splice(nextItemIndex, 0, member);
      } else {
        state.value.columnsExpandedMembers.push(member);
      }
    } else {
      const prevItemIndex = state.value.columnsExpandedMembers.findIndex(
        (e) => e.UName === currentMemberHierarchyItems[indexInSorted - 1].UName
      );
      state.value.columnsExpandedMembers.splice(prevItemIndex + 1, 0, member);
    }
  };
  const collapseOnColumns = (member: any) => {
    const itemIndex = state.value.columnsExpandedMembers.findIndex((e: any) => {
      return e.UName === member.UName;
    });

    state.value.columnsExpandedMembers.splice(itemIndex, 1);
  };

  const flushExpands = () => {
    const columns = queryDesignerStore.columns;
    const notUsedHierarchiesInDrilldownCols =
      state.value.columnsExpandedMembers.filter((e: any) => {
        return !columns.some((member) => {
          return (
            member.originalItem.HIERARCHY_UNIQUE_NAME ===
            e.HIERARCHY_UNIQUE_NAME
          );
        });
      });

    notUsedHierarchiesInDrilldownCols.forEach((member: any) => {
      const itemIndex = state.value.columnsExpandedMembers.findIndex(
        (e: any) => {
          return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
        }
      );

      state.value.columnsExpandedMembers.splice(itemIndex, 1);
    });

    const rows = queryDesignerStore.rows;
    const notUsedHierarchiesInDrilldownRows =
      state.value.rowsExpandedMembers.filter((e: any) => {
        return !rows.some((member) => {
          return (
            member.originalItem.HIERARCHY_UNIQUE_NAME ===
            e.HIERARCHY_UNIQUE_NAME
          );
        });
      });

    notUsedHierarchiesInDrilldownRows.forEach((member: any) => {
      const itemIndex = state.value.rowsExpandedMembers.findIndex((e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      });

      state.value.rowsExpandedMembers.splice(itemIndex, 1);
    });
  };

  queryDesignerStore.$subscribe(
    () => {
      flushDrilldowns();
      flushExpands();
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
  watch(
    state.value.rowsExpandedMembers,
    () => {
      fetchPivotTableData();
    },
    { deep: true }
  );
  watch(
    state.value.columnsExpandedMembers,
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
    expandOnRows,
    expandOnColumns,
    collapseOnRows,
    collapseOnColumns,
    mdx,
  };
});
