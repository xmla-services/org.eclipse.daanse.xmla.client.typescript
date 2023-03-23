<script lang="ts">
import { usePivotTableStore } from "@/stores/PivotTable";
import { optionalArrayToArray } from "@/utils/helpers";
import { provide, ref, watch } from "vue";
import { TinyEmitter } from "tiny-emitter";
import RowsArea from "./Areas/RowsArea.vue";
import ColumnsArea from "./Areas/ColumnsArea.vue";
import CellsArea from "./Areas/CellsArea.vue";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { storeToRefs } from "pinia";
import { useTreeViewDataStore } from "@/stores/TreeView";

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
      } else if (area === "columns") {
        pivotTableStore.drilldownOnColumns(member);
      }
    });
    provide("drillup", async (member: any, area: "columns" | "rows") => {
      const parentLevel = treeViewStore.levels.find((e) => {
        return (
          e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME &&
          e.LEVEL_NUMBER === (member.LNum - 1).toString()
        );
      });

      if (parentLevel) {
        appSettings.loading = true;
        const parentMember = await api.getMember(
          parentLevel,
          member.PARENT_UNIQUE_NAME
        );
        appSettings.loading = false;

        const requestParentLevel = treeViewStore.levels.find((e) => {
          return (
            e.HIERARCHY_UNIQUE_NAME === parentMember.HIERARCHY_UNIQUE_NAME &&
            e.LEVEL_NUMBER ===
              (parseInt(parentMember.LEVEL_NUMBER) - 1).toString()
          );
        });

        if (requestParentLevel) {
          const createdMember = {
            UName: parentMember.PARENT_UNIQUE_NAME,
            LName: requestParentLevel.LEVEL_UNIQUE_NAME,
            HIERARCHY_UNIQUE_NAME: requestParentLevel.HIERARCHY_UNIQUE_NAME,
          };
          if (area === "rows") {
            pivotTableStore.drilldownOnRows(createdMember);
          } else if (area === "columns") {
            pivotTableStore.drilldownOnColumns(createdMember);
          }
        }
      }
    });

    const getPivotTableData = async () => {
      appSettings.loading = true;

      const mdx = pivotTableStore.mdx;

      const mdxResponce = await api.getMDX(mdx);
      const axis0 = optionalArrayToArray(
        mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[0]?.Tuples
          ?.Tuple
      );
      const axis1 = optionalArrayToArray(
        mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[1]?.Tuples
          ?.Tuple
      );
      const cellsArray = optionalArrayToArray(
        mdxResponce.Body.ExecuteResponse.return.root.CellData?.Cell
      );

      columns.value = axis0.map((e: { Member: any }) => {
        return optionalArrayToArray(e.Member);
      });
      rows.value = axis1.map((e: { Member: any }) => {
        return optionalArrayToArray(e.Member);
      });
      cells.value = [...cellsArray];

      appSettings.loading = false;
    };

    watch(mdx, async () => {
      await getPivotTableData();
    });

    return {
      pivotTableStore,
      colStyles,
      rowsStyles,
      eventBus,
      DEFAULT_ROW_HEIGHT_CSS,
      cells,
      rows,
      columns,
    };
  },
  computed: {
    columnsOffset() {
      return this.rows?.[0]?.length * DEFAULT_COLUMN_WIDTH;
    },
    cellsParsed() {
      if (!this.cells.length) return;
      if (!this.rows.length || !this.columns.length) {
        if (this.rows.length === this.columns.length) {
          return [this.cells];
        }
        return [];
      }
      const cp = [...this.cells];

      const columnsArray = [];
      const count = this.columns.length;
      while (cp.length) {
        columnsArray.push(cp.splice(0, count));
      }
      return columnsArray;
    },
    totalContentHeight() {
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
      console.log(this.columns, xAxisDesc);
      console.log(this.rows, yAxisDesc);
      return 0;
    },
  },
  methods: {
    handleScroll(e: any) {
      (
        this.$refs.rowsContainer as HTMLElement
      ).style.transform = `translateY(-${e.target.scrollTop}px)`;
      (
        this.$refs.columnsContainer as HTMLElement
      ).style.transform = `translateX(-${e.target.scrollLeft}px)`;
    },
    onResize(e: MouseEvent) {
      this.eventBus.emit("onResize", e);
    },
    onStopResize() {
      this.eventBus.emit("onStopResize");
    },
  },
  components: { RowsArea, ColumnsArea, CellsArea },
};
</script>

<template>
  <div
    class="pivotTable_container"
    @mousemove="onResize"
    @mouseup="onStopResize"
    @mouseleave="onStopResize"
  >
    <div class="pivotTable">
      <ColumnsArea
        :columnsStyles="colStyles"
        :columnsOffset="columnsOffset"
        :columns="columns"
      ></ColumnsArea>
      <div class="d-flex flex-row overflow-hidden">
        <RowsArea :rows="rows" :rowsStyles="rowsStyles"></RowsArea>
        <CellsArea
          :rowsStyles="rowsStyles"
          :colsStyles="colStyles"
          :cells="cellsParsed"
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
</style>
