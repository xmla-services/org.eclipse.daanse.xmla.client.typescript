/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { defineStore } from "pinia";
import {
  getHierarchyDesc,
  type HierarchyTreeItem,
  type MeasureTreeItem,
} from "./TreeViewItems";
import { computed, ref, watch } from "vue";
import { useLocationManager } from "@/composables/locationManager";
import { getMeasureDesc } from "./TreeViewItems";
import { useMetadataStorage } from "@/composables/metadataStorage";

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

export const useQueryDesignerStore = defineStore("queryDesignerStore", () => {
  const locationManager = useLocationManager();

  const filters = ref(<HierarchyTreeItem[]>[]);
  const rows = ref(<HierarchyTreeItem[]>[]);
  const columns = ref(<(HierarchyTreeItem | ValuesItem)[]>[]);
  const measures = ref(<MeasureTreeItem[]>[]);
  const manualUpdate = ref(false);

  const queryModel = computed(() => {
    return {
      filters: filters.value.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
      rows: rows.value.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
      columns: columns.value.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
      measures: measures.value.map((e) => e.originalItem.MEASURE_UNIQUE_NAME),
    };
  });

  const hierarchyUniqueNames = computed(() => {
    const uniqueNames = [
      ...filters.value.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
      ...rows.value.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
      ...columns.value.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME),
    ];

    return uniqueNames;
  });

  const restoreState = async () => {
    const metadataStorage = useMetadataStorage();
    const metadata = await metadataStorage.getMetadataStorage();

    console.log(metadata);

    const restoredRows = metadata.hierarchies.filter((e) => {
      return locationManager.queryState.value.rows.some(
        (uname) => uname === e.HIERARCHY_UNIQUE_NAME
      );
    });
    const restoredColumns = metadata.hierarchies.filter((e) => {
      return locationManager.queryState.value.columns.some(
        (uname) => uname === e.HIERARCHY_UNIQUE_NAME
      );
    });
    const restoredMeasures = metadata.measures.filter((e) => {
      return locationManager.queryState.value.measures.some(
        (uname) => uname === e.MEASURE_UNIQUE_NAME
      );
    });

    rows.value.push(...restoredRows.map((e) => getHierarchyDesc(e)));
    columns.value.push(...restoredColumns.map((e) => getHierarchyDesc(e)));
    measures.value.push(...restoredMeasures.map((e) => getMeasureDesc(e)));
  };

  restoreState();

  watch(
    () => rows.value,
    () => {
      locationManager.setRowsDescription(
        rows.value.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME)
      );
    },
    { deep: true }
  );

  watch(
    () => columns.value,
    () => {
      locationManager.setColumnsDescription(
        columns.value.map((e) => e.originalItem.HIERARCHY_UNIQUE_NAME)
      );
    },
    { deep: true }
  );

  watch(
    () => measures.value,
    () => {
      locationManager.setMeasuresDescription(
        measures.value.map((e) => e.originalItem.MEASURE_UNIQUE_NAME)
      );
    },
    { deep: true }
  );

  return {
    filters,
    rows,
    columns,
    measures,
    manualUpdate,
    queryModel,
    hierarchyUniqueNames,
  };
});
