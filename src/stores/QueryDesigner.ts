/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { defineStore } from "pinia";
import type { HierarchyTreeItem, MeasureTreeItem } from "./TreeViewItems";

export interface ValuesItem {
  id: "Values";
  type: "Values";
  caption: "Values";
  originalItem: {
    HIERARCHY_UNIQUE_NAME: "Values";
  };
  filters: null;
  children: [];
}

export const useQueryDesignerStore = defineStore("queryDesignerStore", {
  state: () => {
    return {
      filters: <HierarchyTreeItem[]>[],
      rows: <HierarchyTreeItem[]>[],
      columns: <(HierarchyTreeItem | ValuesItem)[]>[],
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
