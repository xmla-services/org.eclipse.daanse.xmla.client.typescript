<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import PivotTableWidgetSettings from "./PivotTableWidgetSettings.vue";
import { useStoreManager } from "@/composables/storeManager";
import { optionalArrayToArray } from "@/utils/helpers";
import { provide, ref, watch, type Ref, computed, inject } from "vue";
import { TinyEmitter } from "tiny-emitter";
import { useElementSize } from "@vueuse/core";
import { debounce } from "lodash";
import PivotTable from "./PivotTable";
import RowsArea from "../../PivotTable/Areas/RowsArea.vue";
import ColumnsArea from "../../PivotTable/Areas/ColumnsArea.vue";
import CellsArea from "../../PivotTable/Areas/CellsArea.vue";
// import DrillthroughModal from "../../Modals/DrillthroughModal.vue";
import PivotTableSettingsButton from "@/components/PivotTable/PivotTableSettingsButton.vue";
import type { XMLAStore } from "@/stores/Widgets/XMLAStore";

const DEFAULT_COLUMN_WIDTH = 150;
const DEFAULT_ROW_HEIGHT = 30;
const DEFAULT_ROW_HEIGHT_CSS = `${DEFAULT_ROW_HEIGHT}px`;
const inited = ref(false);
const storeManager = useStoreManager();
const settingsComponent = PivotTableWidgetSettings;

const EventBus = inject("customEventBus") as any;

const storeId = ref("");

const cube = ref(null as any);
const catalog = ref(null as any);

const sampleMdx = `
SELECT
Hierarchize(AddCalculatedMembers({[Store].[(All)].members})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME,[Store].[Store Name].[Store Type],[Store].[Store Name].[Store Manager],[Store].[Store Name].[Store Sqft],[Store].[Store Name].[Grocery Sqft],[Store].[Store Name].[Frozen Sqft],[Store].[Store Name].[Meat Sqft],[Store].[Store Name].[Has coffee bar],[Store].[Store Name].[Street address] ON 1,

Hierarchize(AddCalculatedMembers({[Gender].[(All)].members})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME ON 0
FROM [Sales] CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS
`;

const mdx = ref(sampleMdx);

watch(storeId, () => {
  getData();
});

watch(catalog, () => {
  getData();
});

watch(cube, () => {
  getData();
});

watch(mdx, () => {
  getData();
});

const updateFn = async () => {
  await getPivotTableData();
  inited.value = true;
};

const getData = async () => {
  updateFn();
};

watch(storeId, (newVal, oldVal) => {
  EventBus.off(`UPDATE:${oldVal}`, updateFn);
  EventBus.on(`UPDATE:${storeId.value}`, updateFn);

  getData();
});

defineExpose({
  settingsComponent,
  storeId,
  mdx,
  catalog,
  cube,
});

// Pivot table logic
const pivotTableControl = new PivotTable();

const rows = ref([] as any[]);
const columns = ref([] as any[]);
const cells = ref([] as any[]);
const propertiesRows = ref([] as any[]);
const propertiesCols = ref([] as any[]);

const colStyles = ref([...pivotTableControl.styles.columns]);
const rowsStyles = ref([...pivotTableControl.styles.rows]);

const rowsContainer = ref(null) as Ref<any>;
const { width: rowsWidth } = useElementSize(rowsContainer);

const eventBus = new TinyEmitter();
provide("pivotTableEventBus", eventBus);

const onResize = (e: MouseEvent) => {
  eventBus.emit("onResize", e);
};

const onStopResize = () => {
  eventBus.emit("onStopResize");
};

const drillthrough = () => {
  console.log(drillthrough);
};

const columnsOffset = computed(() => {
  return rows.value?.[0]?.length * DEFAULT_COLUMN_WIDTH;
});

const setRowsStyles = (i: number, value: number) => {
  rowsStyles.value[i] = value;
};

const setColumnsStyles = (i: number, value: number) => {
  colStyles.value[i] = value;
};

provide("setRowsStyles", setRowsStyles);
provide("setColumnsStyles", setColumnsStyles);

provide("drilldown", (value, area) => {
  EventBus.emit(`DRILLDOWN:${storeId.value}`, { value, area });
});
provide("drillup", (value, area) => {
  EventBus.emit(`DRILLUP:${storeId.value}`, { value, area });
});
provide("expand", (value, area) => {
  EventBus.emit(`EXPAND:${storeId.value}`, { value, area });
});
provide("collapse", (value, area) => {
  EventBus.emit(`COLLAPSE:${storeId.value}`, { value, area });
});

const parseCells = (cells: any[], columns: any[], rows: any[]) => {
  if (!cells.length) return [];
  if (!rows.length) {
    return [cells];
  } else if (!columns.length) {
    return cells.map((e) => [e]);
  }
  const cp = [...cells] as any[];

  const columnsArray = [] as any[];
  const count = columns.length;
  while (cp.length) {
    columnsArray.push(cp.splice(0, count));
  }
  return columnsArray;
};

const totalContentSize = computed(() => {
  const columnsDesc = [
    ...propertiesCols.value,
    ...(columns.value.length ? columns.value : [{}]),
  ];
  const xAxisDesc = columnsDesc.reduce(
    (
      acc: {
        items: any[];
        totalWidth: number;
      },
      _: any,
      i: number,
    ) => {
      acc.items[i] = {
        start: acc.totalWidth,
        width: colStyles.value[i] || DEFAULT_COLUMN_WIDTH,
      };
      acc.totalWidth =
        acc.totalWidth + (colStyles.value[i] || DEFAULT_COLUMN_WIDTH);
      return acc;
    },
    { items: [], totalWidth: 0 },
  );

  const rowsDesc = [
    ...propertiesRows.value,
    ...(rows.value.length ? rows.value : [{}]),
  ];
  const yAxisDesc = rowsDesc.reduce(
    (
      acc: {
        items: any[];
        totalWidth: number;
      },
      _: any,
      i: number,
    ) => {
      acc.items[i] = {
        start: acc.totalWidth,
        width: rowsStyles.value[i] || DEFAULT_ROW_HEIGHT,
      };
      acc.totalWidth =
        acc.totalWidth + (rowsStyles.value[i] || DEFAULT_ROW_HEIGHT);
      return acc;
    },
    { items: [], totalWidth: 0 },
  );

  return {
    xAxis: xAxisDesc,
    yAxis: yAxisDesc,
  };
});

const getPivotTableData = debounce(async () => {
  const store = storeManager.getStore(storeId.value) as unknown as XMLAStore;

  const mdxResponce = await store.getData();
  console.log(mdxResponce);
  // const properties = (await metadataStorage.getMetadataStorage()).properties;
  // console.log(properties);
  const axis0 = optionalArrayToArray(
    optionalArrayToArray(
      mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis,
    )?.[0]?.Tuples?.Tuple,
  );
  let axis1 = [] as any[];
  if (
    mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[1]?.__attrs
      .name === "Axis1"
  ) {
    axis1 = optionalArrayToArray(
      mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[1]?.Tuples
        ?.Tuple,
    );
  }
  // else if (
  //   mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[1]?.__attrs
  //     .name === "SlicerAxis"
  // ) {
  //   axis1 = optionalArrayToArray(
  //     mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[1]?.Tuples
  //       ?.Tuple,
  //   );
  // }

  console.log(axis1);

  // console.log(queryDesignerState.measures);
  // if (queryDesignerState.measures.length === 1) {
  //   const mes = queryDesignerState.measures[0];
  //   if (axis1.length === 0) {
  //     axis1.push({
  //       Member: {
  //         Caption: mes.originalItem.MEASURE_CAPTION,
  //         UName: mes.originalItem.MEASURE_UNIQUE_NAME,
  //       },
  //     });
  //   }
  //   if (axis0.length === 0) {
  //     axis0.push({
  //       Member: {
  //         Caption: mes.originalItem.MEASURE_CAPTION,
  //         UName: mes.originalItem.MEASURE_UNIQUE_NAME,
  //       },
  //     });
  //   }
  // }

  const cellsArray = optionalArrayToArray(
    mdxResponce.Body.ExecuteResponse.return.root.CellData?.Cell,
  );

  // if (!queryDesignerState.columns.length) {
  //   columns.value = axis1.map((e: { Member: any }) => {
  //     return optionalArrayToArray(e.Member);
  //   });
  //   rows.value = axis0.map((e: { Member: any }) => {
  //     return optionalArrayToArray(e.Member);
  //   });
  //   cells.value = parseCells(cellsArray, columns.value, rows.value);
  // } else {
  columns.value = axis0.map((e: { Member: any }) => {
    return optionalArrayToArray(e.Member);
  });
  rows.value = axis1.map((e: { Member: any }) => {
    return optionalArrayToArray(e.Member);
  });
  cells.value = parseCells(cellsArray, columns.value, rows.value);
  // }

  const columnProperties = [] as any[];
  const rowsProperties = [] as any[];

  // columns.value[0]?.forEach((col) => {
  //   const colPropsShown = pivotTableStore.state.membersWithProps.includes(
  //     col.HIERARCHY_UNIQUE_NAME,
  //   );
  //   if (!colPropsShown) return;

  //   const colProps: any[] = properties.filter(
  //     (prop) => prop.HIERARCHY_UNIQUE_NAME === col.HIERARCHY_UNIQUE_NAME,
  //   );
  //   columnProperties.push(...colProps);
  // });

  // rows.value[0]?.forEach((row) => {
  //   const rowPropsShown = pivotTableStore.state.membersWithProps.includes(
  //     row.HIERARCHY_UNIQUE_NAME,
  //   );
  //   if (!rowPropsShown) return;

  //   const rowProps: any[] = properties.filter(
  //     (prop) => prop.HIERARCHY_UNIQUE_NAME === row.HIERARCHY_UNIQUE_NAME,
  //   );
  //   rowsProperties.push(...rowProps);
  // });

  const colPropertiesDescription = optionalArrayToArray(
    optionalArrayToArray(
      mdxResponce.Body.ExecuteResponse.return.root.OlapInfo?.AxesInfo.AxisInfo,
    )[0]?.HierarchyInfo,
  );

  let rowPropertiesDescription = [] as any[];
  // if (!queryDesignerState.columns.length) {
  //   rowPropertiesDescription = optionalArrayToArray(
  //     optionalArrayToArray(
  //       mdxResponce.Body.ExecuteResponse.return.root.OlapInfo?.AxesInfo
  //         .AxisInfo,
  //     )[0]?.HierarchyInfo,
  //   );
  // } else {
  rowPropertiesDescription = optionalArrayToArray(
    optionalArrayToArray(
      mdxResponce.Body.ExecuteResponse.return.root.OlapInfo?.AxesInfo.AxisInfo,
    )[1]?.HierarchyInfo,
  );
  // }

  propertiesRows.value = columnProperties.map((e) => ({
    ...e,
    isProperty: true,
  }));

  propertiesCols.value = rowsProperties.map((e) => ({
    ...e,
    isProperty: true,
  }));

  const propertiesCells = propertiesRows.value.map((prop) => {
    return columns.value.map((col) => {
      const propsOrigin = col.find(
        (e) => e.HIERARCHY_UNIQUE_NAME === prop.HIERARCHY_UNIQUE_NAME,
      );

      const colHierarchyIndex = col.indexOf(propsOrigin);
      const desc = colPropertiesDescription[colHierarchyIndex];
      const propName = `${prop.HIERARCHY_UNIQUE_NAME}.[${prop.PROPERTY_NAME}]`;
      const objPropName = Object.entries(desc).find((keyValue: any) => {
        if (Array.isArray(keyValue[1])) {
          const att = keyValue[1].find((entry) => {
            return entry.__attrs?.name === propName;
          });
          if (att) return att;
        } else {
          return keyValue[1]?.__attrs?.name === propName;
        }
      });

      if (objPropName) {
        return {
          Value: propsOrigin[objPropName[0]],
        };
      }

      return {
        Value: "",
      };
    });
  });

  cells.value = [...propertiesCells, ...cells.value];

  cells.value = cells.value.map((row, i) => {
    const propertiesCells = propertiesCols.value.map((prop) => {
      const rowDesc = rows.value[i];

      const propsOrigin = rowDesc.find(
        (e) => e.HIERARCHY_UNIQUE_NAME === prop.HIERARCHY_UNIQUE_NAME,
      );

      const rowHierarchyIndex = rowDesc.indexOf(propsOrigin);
      const desc = rowPropertiesDescription[rowHierarchyIndex];
      const propName = `${prop.HIERARCHY_UNIQUE_NAME}.[${prop.PROPERTY_NAME}]`;
      const objPropName = Object.entries(desc)?.find((keyValue: any) => {
        return keyValue[1]?.__attrs?.name === propName;
      });

      if (objPropName) {
        return {
          Value: propsOrigin[objPropName[0]],
        };
      }

      return {
        Value: "",
      };
    });

    return [...propertiesCells, ...row];
  });

  console.log("rows", rows.value);
  console.log("columnd", columns.value);
  console.log("cells", cells.value);
}, 100);
</script>

<template>
  <template v-if="inited">
    <div
      class="pivotTable_container"
      @mousemove="onResize"
      @mouseup="onStopResize"
      @mouseleave="onStopResize"
      @contextmenu.stop.prevent=""
    >
      <div class="placeholder">
        <div class="bar">
          <!-- <va-button
            v-if="pivotTableStore.state.inited"
            icon="download"
            preset="secondary"
            color="secondary"
            @click="downloadCSV"
          /> -->

          <PivotTableSettingsButton />
        </div>
      </div>
      <!-- <DrillthroughModal ref="drillthroughModal" /> -->
      <div class="pivotTable">
        <ColumnsArea
          :columnsStyles="colStyles"
          :columnsOffset="columnsOffset"
          :columns="[...propertiesCols, ...columns]"
          :totalContentSize="totalContentSize"
          :leftPadding="rowsWidth"
          :storeId="storeId"
        ></ColumnsArea>
        <div class="d-flex flex-row overflow-hidden vertical-scroll">
          <RowsArea
            ref="rowsContainer"
            :rows="[...propertiesRows, ...rows]"
            :rowsStyles="rowsStyles"
            :totalContentSize="totalContentSize"
            :storeId="storeId"
          ></RowsArea>
          <CellsArea
            :rowsStyles="rowsStyles"
            :colsStyles="colStyles"
            :totalContentSize="totalContentSize"
            :cells="cells"
            @drillthrough="drillthrough"
          ></CellsArea>
        </div>
      </div>
    </div>
  </template>
</template>

<style lang="scss">
.pivotTable_container {
  padding: v-bind(DEFAULT_ROW_HEIGHT_CSS);
  height: 100%;

  .bar {
    position: absolute;
    margin-top: -29px;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-end;
  }
  .placeholder {
    height: 8px;
  }
}
.pivotTable {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.vertical-scroll {
  height: 100%;
}
</style>
