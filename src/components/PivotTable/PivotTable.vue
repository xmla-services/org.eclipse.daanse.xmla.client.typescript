<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts">
import { usePivotTableStore } from "@/stores/PivotTable";
import { findMaxinArrayByField, optionalArrayToArray } from "@/utils/helpers";
import { onMounted, provide, ref, watch, type Ref, h } from "vue";
import { TinyEmitter } from "tiny-emitter";
import RowsArea from "./Areas/RowsArea.vue";
import ColumnsArea from "./Areas/ColumnsArea.vue";
import CellsArea from "./Areas/CellsArea.vue";
import DrillthroughModal from "../Modals/DrillthroughModal.vue";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { storeToRefs } from "pinia";
import { useChartStore } from "@/stores/Chart";
import { useElementSize } from "@vueuse/core";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";
import { debounce } from "lodash";
import { useMetadataStorage } from "@/composables/metadataStorage";
import PivotTableSettingsButton from "@/components/PivotTable/PivotTableSettingsButton.vue";
import { useToast } from "vuestic-ui";

const DEFAULT_COLUMN_WIDTH = 150;
const DEFAULT_ROW_HEIGHT = 30;

const DEFAULT_ROW_HEIGHT_CSS = `${DEFAULT_ROW_HEIGHT}px`;

export default {
  setup() {
    const pivotTableStore = usePivotTableStore();
    const { mdx } = storeToRefs(pivotTableStore);
    const appSettings = useAppSettingsStore();
    const api = appSettings.getApi();
    const metadataStorage = useMetadataStorage();
    const queryDesignerState = useQueryDesignerStore();
    const chartStore = useChartStore('Chart')();
    const rowsContainer = ref(null) as Ref<any>;
    const { width: rowsWidth } = useElementSize(rowsContainer);

    const colStyles = ref([...pivotTableStore.state.styles.columns] as any[]);
    const rowsStyles = ref([...pivotTableStore.state.styles.rows] as any[]);

    const eventBus = new TinyEmitter();
    provide("eventBus", eventBus);

    pivotTableStore.state.inited = true;

    const setRowsStyles = (i: number, styles: number) => {
      rowsStyles.value[i] = styles;
    };
    const setColumnsStyles = (i: number, styles: number) => {
      colStyles.value[i] = styles;
    };

    const rows = ref([] as any[]);
    const columns = ref([] as any[]);
    const cells = ref([] as any[]);
    const propertiesRows = ref([] as any[]);
    const propertiesCols = ref([] as any[]);

    provide("setRowsStyles", setRowsStyles);
    provide("setColumnsStyles", setColumnsStyles);
    provide("drilldown", (member: any, area: "columns" | "rows") => {
      if (area === "rows") {
        pivotTableStore.drilldownOnRows(member);
        chartStore.drilldownOnRows(member);
      } else if (area === "columns") {
        pivotTableStore.drilldownOnColumns(member);
        chartStore.drilldownOnColumns(member);
      }
    });
    provide("drillup", async (member: any, area: "columns" | "rows") => {
      const levels = (await metadataStorage.getMetadataStorage()).levels;

      const parentLevel = levels.find((e) => {
        return (
          e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME &&
          e.LEVEL_NUMBER === Math.max(parseInt(member.LNum) - 1, 0).toString()
        );
      });

      if (parentLevel) {
        const loadingId = appSettings.setLoadingState();
        const parentMember = await api.getMember(
          parentLevel,
          member.PARENT_UNIQUE_NAME,
        );
        appSettings.removeLoadingState(loadingId);

        const requestParentLevel = levels.find((e) => {
          return (
            e.HIERARCHY_UNIQUE_NAME === parentMember.HIERARCHY_UNIQUE_NAME &&
            e.LEVEL_NUMBER ===
              Math.max(parseInt(parentMember.LEVEL_NUMBER) - 1, 0).toString()
          );
        });
        if (requestParentLevel) {
          const createdMember = {
            UName: parentMember.PARENT_UNIQUE_NAME,
            LName: requestParentLevel.LEVEL_UNIQUE_NAME,
            HIERARCHY_UNIQUE_NAME: requestParentLevel.HIERARCHY_UNIQUE_NAME,
            LNum: requestParentLevel.LEVEL_NUMBER,
          };
          if (area === "rows") {
            pivotTableStore.drilldownOnRows(createdMember);
            chartStore.drilldownOnRows(createdMember);
          } else if (area === "columns") {
            pivotTableStore.drilldownOnColumns(createdMember);
            chartStore.drilldownOnColumns(createdMember);
          }
        }
      }
    });
    provide("expand", (member: any, area: "columns" | "rows") => {
      if (area === "rows") {
        pivotTableStore.expandOnRows(member);
        chartStore.expandOnRows(member);
      } else if (area === "columns") {
        pivotTableStore.expandOnColumns(member);
        chartStore.expandOnColumns(member);
      }
    });
    provide("collapse", (member: any, area: "columns" | "rows") => {
      if (area === "rows") {
        pivotTableStore.collapseOnRows(member);
        chartStore.collapseOnRows(member);
      } else if (area === "columns") {
        pivotTableStore.collapseOnColumns(member);
        chartStore.collapseOnColumns(member);
      }
    });

    const getPivotTableData = debounce(async () => {
      const loadingId = appSettings.setLoadingState();
      const mdx = pivotTableStore.mdx;

      const mdxResponce = await api.getMDX(mdx);
      console.log(mdxResponce);
      const properties = (await metadataStorage.getMetadataStorage())
        .properties;
      console.log(properties);
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

      console.log(queryDesignerState.measures);
      if (queryDesignerState.measures.length === 1) {
        const mes = queryDesignerState.measures[0];
        if (axis1.length === 0) {
          axis1.push({
            Member: {
              Caption: mes.originalItem.MEASURE_CAPTION,
              UName: mes.originalItem.MEASURE_UNIQUE_NAME,
            },
          });
        }
        if (axis0.length === 0) {
          axis0.push({
            Member: {
              Caption: mes.originalItem.MEASURE_CAPTION,
              UName: mes.originalItem.MEASURE_UNIQUE_NAME,
            },
          });
        }
      }

      const cellsArray = optionalArrayToArray(
        mdxResponce.Body.ExecuteResponse.return.root.CellData?.Cell,
      );

      if (!queryDesignerState.columns.length) {
        columns.value = axis1.map((e: { Member: any }) => {
          return optionalArrayToArray(e.Member);
        });
        rows.value = axis0.map((e: { Member: any }) => {
          return optionalArrayToArray(e.Member);
        });
        cells.value = parseCells(cellsArray, columns.value, rows.value);
      } else {
        columns.value = axis0.map((e: { Member: any }) => {
          return optionalArrayToArray(e.Member);
        });
        rows.value = axis1.map((e: { Member: any }) => {
          return optionalArrayToArray(e.Member);
        });
        cells.value = parseCells(cellsArray, columns.value, rows.value);
      }

      const columnProperties = [] as any[];
      const rowsProperties = [] as any[];

      columns.value[0]?.forEach((col) => {
        const colPropsShown = pivotTableStore.state.membersWithProps.includes(
          col.HIERARCHY_UNIQUE_NAME,
        );
        if (!colPropsShown) return;

        const colProps: any[] = properties.filter(
          (prop) => prop.HIERARCHY_UNIQUE_NAME === col.HIERARCHY_UNIQUE_NAME,
        );
        columnProperties.push(...colProps);
      });

      rows.value[0]?.forEach((row) => {
        const rowPropsShown = pivotTableStore.state.membersWithProps.includes(
          row.HIERARCHY_UNIQUE_NAME,
        );
        if (!rowPropsShown) return;

        const rowProps: any[] = properties.filter(
          (prop) => prop.HIERARCHY_UNIQUE_NAME === row.HIERARCHY_UNIQUE_NAME,
        );
        rowsProperties.push(...rowProps);
      });

      const colPropertiesDescription = optionalArrayToArray(
        optionalArrayToArray(
          mdxResponce.Body.ExecuteResponse.return.root.OlapInfo?.AxesInfo
            .AxisInfo,
        )[0]?.HierarchyInfo,
      );

      let rowPropertiesDescription = [] as any[];
      if (!queryDesignerState.columns.length) {
        rowPropertiesDescription = optionalArrayToArray(
          optionalArrayToArray(
            mdxResponce.Body.ExecuteResponse.return.root.OlapInfo?.AxesInfo
              .AxisInfo,
          )[0]?.HierarchyInfo,
        );
      } else {
        rowPropertiesDescription = optionalArrayToArray(
          optionalArrayToArray(
            mdxResponce.Body.ExecuteResponse.return.root.OlapInfo?.AxesInfo
              .AxisInfo,
          )[1]?.HierarchyInfo,
        );
      }

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

      appSettings.removeLoadingState(loadingId);
    }, 100);

    function parseCells(cells: any[], columns: any[], rows: any[]) {
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
    }

    watch(mdx, async () => {
      await getPivotTableData();
    });

    watch(pivotTableStore.state.membersWithProps, async () => {
      await getPivotTableData();
    });

    onMounted(async () => {
      await getPivotTableData();
    });

    watch(
      () => queryDesignerState.rows,
      async () => {
        await getPivotTableData();
      },
    );

    watch(
      () => queryDesignerState.columns,
      async () => {
        await getPivotTableData();
      },
    );

    return {
      pivotTableStore,
      colStyles,
      rowsStyles,
      eventBus,
      DEFAULT_ROW_HEIGHT_CSS,
      cells,
      rows,
      columns,
      rowsContainer,
      rowsWidth,
      DrillthroughModal,
      propertiesRows,
      propertiesCols,
    };
  },
  computed: {
    columnsOffset() {
      return this.rows?.[0]?.length * DEFAULT_COLUMN_WIDTH;
    },
    totalContentSize() {
      const columns = [
        ...this.propertiesCols,
        ...(this.columns.length ? this.columns : [{}]),
      ];
      const xAxisDesc = columns.reduce(
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
            width: this.colStyles[i] || DEFAULT_COLUMN_WIDTH,
          };
          acc.totalWidth =
            acc.totalWidth + (this.colStyles[i] || DEFAULT_COLUMN_WIDTH);
          return acc;
        },
        { items: [], totalWidth: 0 },
      );

      const rows = [
        ...this.propertiesRows,
        ...(this.rows.length ? this.rows : [{}]),
      ];
      const yAxisDesc = rows.reduce(
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
            width: this.rowsStyles[i] || DEFAULT_ROW_HEIGHT,
          };
          acc.totalWidth =
            acc.totalWidth + (this.rowsStyles[i] || DEFAULT_ROW_HEIGHT);
          return acc;
        },
        { items: [], totalWidth: 0 },
      );

      return {
        xAxis: xAxisDesc,
        yAxis: yAxisDesc,
      };
    },
  },
  methods: {
    onResize(e: MouseEvent) {
      this.eventBus.emit("onResize", e);
    },
    onStopResize() {
      this.eventBus.emit("onStopResize");
    },
    drillthrough(cell) {
      (this.$refs.drillthroughModal as any)?.run({
        rows: this.rows[cell.j],
        columns: this.columns[cell.i],
      });
    },
    downloadCSV() {
      const { init } = useToast();
      try {
        const rowMaxLevel = findMaxinArrayByField(["0", "LNum"], this.rows);
        const colMaxLevel = findMaxinArrayByField(["0", "LNum"], this.columns);

        let csv = [] as any;
        for (let row = 0; row <= colMaxLevel; row++) {
          csv.push([]);
          for (let col = 0; col <= rowMaxLevel; col++) {
            csv[row].push("");
          }
          let fill = "";
          for (let scol = 0; scol < this.columns.length; scol++) {
            let level = parseInt(this.columns[scol][0]["LNum"]);
            if (level == row) {
              csv[row].push(this.columns[scol][0]["Caption"]);
              fill = this.columns[scol][0]["Caption"];
            } else if (level < row) {
              csv[row].push("");
            } else {
              csv[row].push(fill);
            }
          }
        }
        for (let srow = 0; srow < this.rows.length; srow++) {
          let rowl = csv.push([]) - 1;
          let row = csv[rowl];
          let prev = rowl - 1 > 0 ? csv[rowl - 1] : null;
          for (let ecol = 0; ecol <= rowMaxLevel; ecol++) {
            let level = parseInt(this.rows[srow][0]["LNum"]);
            if (prev && prev[ecol] && level > ecol) {
              row.push(prev[ecol]);
            } else if (level == ecol) {
              row.push(this.rows[srow][0]["Caption"]);
            } else {
              row.push("");
            }
          }
          for (let celln = 0; celln < this.cells[srow].length; celln++) {
            row.push(this.cells[srow][celln]["Value"] || "");
          }
        }
        let csvContent =
          "data:text/csv;charset=utf-8," +
          csv.map((e) => e.join(";")).join("\n");
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "export.csv");
        document.body.appendChild(link);
        link.click();
      } catch (e) {
        init({
          message: "Fehler beim Erstellen der CSV-Datein!",
          closeable: false,
          color: "warning",
          duration: 2000,
          position: "bottom-right",
          customClass: "error",
        });
      }
    },
  },
  components: {
    RowsArea,
    ColumnsArea,
    CellsArea,
    DrillthroughModal,
    PivotTableSettingsButton,
  },
};
</script>

<template>
  <div
    class="pivotTable_container"
    @mousemove="onResize"
    @mouseup="onStopResize"
    @mouseleave="onStopResize"
  >
    <div class="placeholder">
      <div class="bar">
        <va-button
          v-if="pivotTableStore.state.inited"
          icon="download"
          preset="secondary"
          color="secondary"
          @click="downloadCSV"
        />

        <PivotTableSettingsButton />
      </div>
    </div>
    <DrillthroughModal ref="drillthroughModal" />
    <div class="pivotTable">
      <ColumnsArea
        :columnsStyles="colStyles"
        :columnsOffset="columnsOffset"
        :columns="[...propertiesCols, ...columns]"
        :totalContentSize="totalContentSize"
        :leftPadding="rowsWidth"
      ></ColumnsArea>
      <div class="d-flex flex-row overflow-hidden vertical-scroll">
        <RowsArea
          ref="rowsContainer"
          :rows="[...propertiesRows, ...rows]"
          :rowsStyles="rowsStyles"
          :totalContentSize="totalContentSize"
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
