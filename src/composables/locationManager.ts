/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watch } from "vue";
import queryString from "query-string";
import { optionalArrayToArray } from "@/utils/helpers";

const queryState = ref({
  basePath: "",
  datasourceUrl: "",
  catalog: "",
  cube: "",
  rows: [] as string[],
  columns: [] as string[],
  measures: [] as string[],
});

export function useLocationManager() {
  const parsed = queryString.parse(window.location.search, {
    arrayFormat: "comma",
  });

  queryState.value.basePath = window.location.origin;
  queryState.value.datasourceUrl = (parsed.uri as string) ?? "";
  queryState.value.catalog = (parsed.catalog as string) ?? "";
  queryState.value.cube = (parsed.cube as string) ?? "";

  const rowsArray = optionalArrayToArray(parsed.rows);
  queryState.value.rows = [...rowsArray];

  const columnsArray = optionalArrayToArray(parsed.columns);
  queryState.value.columns = [...columnsArray];

  const measuresArray = optionalArrayToArray(parsed.measures);
  queryState.value.measures = [...measuresArray];

  const updateLocation = () => {
    const searchString = queryString.stringify(
      {
        uri: queryState.value.datasourceUrl,
        catalog: queryState.value.catalog,
        cube: queryState.value.cube,
        rows: queryState.value.rows,
        columns: queryState.value.columns,
        measures: queryState.value.measures,
      },
      { arrayFormat: "comma" }
    );

    const url = new URL(queryState.value.basePath);
    url.search = searchString;

    if (queryState.value.datasourceUrl) {
      window.history.replaceState({}, "Pivot grid", url);
    }
  };

  watch(
    queryState,
    () => {
      updateLocation();
    },
    { deep: true, immediate: false }
  );

  const setRowsDescription = (rows: string[]) => {
    queryState.value.rows = [...rows];
  };

  const setColumnsDescription = (columns: string[]) => {
    queryState.value.columns = [...columns];
  };

  const setMeasuresDescription = (measures: string[]) => {
    queryState.value.measures = [...measures];
  };

  return {
    queryState,
    setRowsDescription,
    setColumnsDescription,
    setMeasuresDescription,
  };
}
