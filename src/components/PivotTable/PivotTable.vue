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
import { optionalArrayToArray } from "@/utils/helpers";
import { onMounted, provide, ref, watch, type Ref } from "vue";
import { TinyEmitter } from "tiny-emitter";
import RowsArea from "./Areas/RowsArea.vue";
import ColumnsArea from "./Areas/ColumnsArea.vue";
import CellsArea from "./Areas/CellsArea.vue";
import DrillthroughModal from "../Modals/DrillthroughModal.vue";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { storeToRefs } from "pinia";
import { useTreeViewDataStore } from "@/stores/TreeView";
import { useChartStore } from "@/stores/Chart";
import { useElementSize } from "@vueuse/core";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";

const DEFAULT_COLUMN_WIDTH = 150;
const DEFAULT_ROW_HEIGHT = 30;

const DEFAULT_ROW_HEIGHT_CSS = `${DEFAULT_ROW_HEIGHT}px`;

export default {
  setup() {
    const pivotTableStore = usePivotTableStore();
    const { mdx } = storeToRefs(pivotTableStore);
    const appSettings = useAppSettingsStore();
    const api = appSettings.getApi();
    const treeViewStore = useTreeViewDataStore();
    const queryDesignerState = useQueryDesignerStore();
    const chartStore = useChartStore();
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
      const parentLevel = treeViewStore.levels.find((e) => {
        return (
          e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME &&
          e.LEVEL_NUMBER === Math.max(parseInt(member.LNum) - 1, 0).toString()
        );
      });

      if (parentLevel) {
        const loadingId = appSettings.setLoadingState();
        const parentMember = await api.getMember(
          parentLevel,
          member.PARENT_UNIQUE_NAME
        );
        appSettings.removeLoadingState(loadingId);

        const requestParentLevel = treeViewStore.levels.find((e) => {
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

    const getPivotTableData = async () => {
      const loadingId = appSettings.setLoadingState();
      const mdx = pivotTableStore.mdx;

      const mdxResponce = await api.getMDX(mdx);
      const axis0 = optionalArrayToArray(
        optionalArrayToArray(
          mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis
        )?.[0]?.Tuples?.Tuple
      );
      const axis1 = optionalArrayToArray(
        mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[1]?.Tuples
          ?.Tuple
      );
      const cellsArray = optionalArrayToArray(
        mdxResponce.Body.ExecuteResponse.return.root.CellData?.Cell
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

      console.log(cells);

      appSettings.removeLoadingState(loadingId);
    };

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

    onMounted(async () => {
      await getPivotTableData();
    });

    watch(
      () => queryDesignerState.rows,
      async () => {
        await getPivotTableData();
      }
    );

    watch(
      () => queryDesignerState.columns,
      async () => {
        await getPivotTableData();
      }
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
    };
  },
  computed: {
    columnsOffset() {
      return this.rows?.[0]?.length * DEFAULT_COLUMN_WIDTH;
    },
    totalContentSize() {
      const xAxisDesc = this.columns.reduce(
        (
          acc: {
            items: any[];
            totalWidth: number;
          },
          _: any,
          i: number
        ) => {
          acc.items[i] = {
            start: acc.totalWidth,
            width: this.colStyles[i] || DEFAULT_COLUMN_WIDTH,
          };
          acc.totalWidth =
            acc.totalWidth + (this.colStyles[i] || DEFAULT_COLUMN_WIDTH);
          return acc;
        },
        { items: [], totalWidth: 0 }
      );
      const yAxisDesc = this.rows.reduce(
        (
          acc: {
            items: any[];
            totalWidth: number;
          },
          _: any,
          i: number
        ) => {
          acc.items[i] = {
            start: acc.totalWidth,
            width: this.rowsStyles[i] || DEFAULT_ROW_HEIGHT,
          };
          acc.totalWidth =
            acc.totalWidth + (this.rowsStyles[i] || DEFAULT_ROW_HEIGHT);
          return acc;
        },
        { items: [], totalWidth: 0 }
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
  },
  components: { RowsArea, ColumnsArea, CellsArea, DrillthroughModal },
};
</script>

<template>
  <div
    class="pivotTable_container"
    @mousemove="onResize"
    @mouseup="onStopResize"
    @mouseleave="onStopResize"
  >
    <DrillthroughModal ref="drillthroughModal" />
    <div class="pivotTable">
      <ColumnsArea
        :columnsStyles="colStyles"
        :columnsOffset="columnsOffset"
        :columns="columns"
        :totalContentSize="totalContentSize"
        :leftPadding="rowsWidth"
      ></ColumnsArea>
      <div class="d-flex flex-row overflow-hidden vertical-scroll">
        <RowsArea
          ref="rowsContainer"
          :rows="rows"
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
