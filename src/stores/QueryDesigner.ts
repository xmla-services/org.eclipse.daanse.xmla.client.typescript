import { defineStore } from "pinia";
import type { HierarchyTreeItem, MeasureTreeItem } from "./TreeViewItems";

export const useQueryDesignerStore = defineStore("queryDesignerStore", {
  state: () => {
    return {
      filters: <HierarchyTreeItem[]>[],
      rows: <HierarchyTreeItem[]>[],
      columns: <HierarchyTreeItem[]>[],
      measures: <MeasureTreeItem[]>[],
      manualUpdate: false,
    };
  },
  getters: {
    queryModel(): any {
      return {
        filters: this.filters.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
        rows: this.rows.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
        columns: this.columns.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
        measures: this.measures.map((e) => e.originalItem.MEASURE_UNIQUE_NAME),
      };
    },
    hierarchyUniqueNames(): string[] {
      const uniqueNames = [
        ...this.filters.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
        ...this.rows.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
        ...this.columns.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
      ];

      return uniqueNames;
    },
  },
});
