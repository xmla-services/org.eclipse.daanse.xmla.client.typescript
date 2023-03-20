<script lang="ts">
import { usePivotTableStore } from "@/stores/PivotTable";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";
import { optionalArrayToArray } from "@/utils/helpers";
import { ref } from "vue";

const DEFAULT_COLUMN_WIDTH = 150;
const DEFAULT_ROW_HEIGHT = 30;

export default {
  setup() {
    const queryDesignerStore = useQueryDesignerStore();
    const pivotTableStore = usePivotTableStore();
    const resizeInProg = ref(false);

    const colStyles = ref([] as any[]);
    const rowStyles = ref([] as any[]);
    const itemResized = ref(null as any);

    pivotTableStore.state.inited = true;

    return {
      pivotTableStore,
      queryDesignerStore,
      resizeInProg,
      colStyles,
      rowStyles,
      itemResized,
      DEFAULT_ROW_HEIGHT: `${DEFAULT_ROW_HEIGHT}px`,
      DEFAULT_COLUMN_WIDTH: `${DEFAULT_COLUMN_WIDTH}px`,
    };
  },
  computed: {
    columns() {
      const cols = this.pivotTableStore.state.columns.map(
        (e: { Member: any }) => {
          return optionalArrayToArray(e.Member);
        }
      );

      return cols;
    },
    rows() {
      const rows = this.pivotTableStore.state.rows.map((e: { Member: any }) => {
        return optionalArrayToArray(e.Member);
      });

      return rows;
      // return this.pivotTableStore.rows;
    },
    cellsParsed() {
      if (!this.pivotTableStore.state.cells.length) return;
      if (
        !this.pivotTableStore.state.rows.length ||
        !this.pivotTableStore.state.columns.length
      ) {
        if (
          this.pivotTableStore.state.rows.length ===
          this.pivotTableStore.state.columns.length
        ) {
          return [this.pivotTableStore.state.cells];
        }
        return [];
      }

      const cp = [...this.pivotTableStore.state.cells];
      const result = [] as any[][];
      const colsArray = [];
      const count = this.pivotTableStore.state.rows.length;

      while (cp.length) {
        colsArray.push(cp.splice(0, count));
      }

      for (let j = 0; j < colsArray[0].length; j++) {
        const tmp = [] as any[];
        for (let i = 0; i < colsArray.length; i++) {
          tmp.push(colsArray[i][j]);
        }

        result.push(tmp);
      }

      return result;
    },
    totalContentHeight() {
      const xAxisDesc = this.columns.reduce(
        (acc: { items: any[]; totalWidth: number }, _: any, i: number) => {
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
        (acc: { items: any[]; totalWidth: number }, _: any, i: number) => {
          acc.items[i] = {
            start: acc.totalWidth,
            width: this.rowStyles[i] || DEFAULT_ROW_HEIGHT,
          };
          acc.totalWidth =
            acc.totalWidth + (this.rowStyles[i] || DEFAULT_ROW_HEIGHT);

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
    getColumnMemberStyle(i: number, j: number) {
      const currentMember = this.columns?.[i]?.[j];
      const nextMember = this.columns?.[i - 1]?.[j];

      if (!currentMember || !nextMember) return;

      if (currentMember.UName === nextMember.UName) {
        return {
          "border-left": "none",
        };
      }
      return {};
    },
    getColumnMemberCaption(i: number, j: number) {
      const currentMember = this.columns?.[i]?.[j];
      const nextMember = this.columns?.[i - 1]?.[j];

      if (!currentMember || !nextMember) return currentMember.Caption;

      if (currentMember.UName === nextMember.UName) {
        return "";
      }
      return currentMember.Caption;
    },
    getRowMemberStyle(i: number, j: number) {
      const currentMember = this.rows?.[i]?.[j];
      const nextMember = this.rows?.[i - 1]?.[j];

      if (!currentMember || !nextMember) return;

      if (currentMember.UName === nextMember.UName) {
        return {
          "border-top": "none",
        };
      }
      return {};
    },
    getRowMemberCaption(i: number, j: number) {
      const currentMember = this.rows?.[i]?.[j];
      const nextMember = this.rows?.[i - 1]?.[j];

      if (!currentMember || !nextMember) return currentMember.Caption;

      if (currentMember.UName === nextMember.UName) {
        return "";
      }
      return currentMember.Caption;
    },
    getColumnHeaderOffsetStyle() {
      return {
        "margin-left": `${this.rows?.[0]?.length * DEFAULT_COLUMN_WIDTH}px`,
      };
    },
    getColumnHeaderStyle(i: number) {
      return {
        width: `${this.colStyles[i] || DEFAULT_COLUMN_WIDTH}px`,
      };
    },
    getRowHeaderStyle(i: number) {
      return {
        height: `${this.rowStyles[i] || DEFAULT_ROW_HEIGHT}px`,
      };
    },
    getCellValue(cell: any) {
      if (typeof cell.FmtValue === "string") return cell.FmtValue;
      return "";
    },
    getCellStyle(i: number, j: number) {
      return {
        width: `${this.colStyles[i] || DEFAULT_COLUMN_WIDTH}px`,
        height: `${this.rowStyles[j] || DEFAULT_ROW_HEIGHT}px`,
      };
    },
    handleScroll(e: any) {
      (
        this.$refs.rowsContainer as HTMLElement
      ).style.transform = `translateY(-${e.target.scrollTop}px)`;
      (
        this.$refs.columnsContainer as HTMLElement
      ).style.transform = `translateX(-${e.target.scrollLeft}px)`;
    },
    onResize(e: MouseEvent) {
      if (this.resizeInProg) {
        const index = this.itemResized.index;
        if (this.itemResized.area === "columns") {
          this.colStyles[index] =
            (this.colStyles[index] || DEFAULT_COLUMN_WIDTH) + e.movementX;
        } else if (this.itemResized.area === "rows") {
          this.rowStyles[index] =
            (this.rowStyles[index] || DEFAULT_ROW_HEIGHT) + e.movementY;
        }
      }
    },
    onStartResize(e: any, i: number, area: "columns" | "rows") {
      this.resizeInProg = true;
      this.itemResized = {
        area,
        index: i,
      };
    },
    onStopResize() {
      this.resizeInProg = false;
      // Save changes to store
    },
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
    <!-- {{ queryDesignerStore.queryModel }} -->
    <div class="pivotTable">
      <div class="columnHeader_container" :style="getColumnHeaderOffsetStyle()">
        <div
          ref="columnsContainer"
          class="columnScroller"
          :style="getColumnHeaderStyle"
        >
          <div
            class="columnHeader"
            v-for="(column, i) in columns"
            :key="i"
            :style="getColumnHeaderStyle(i)"
          >
            <div
              v-if="i > 0"
              class="col_dragAreaLeft"
              @mousedown="onStartResize($event, i - 1, 'columns')"
            ></div>
            <div
              v-for="(member, j) in column"
              :key="member.UNAME"
              class="columnMember"
              :style="getColumnMemberStyle(i, j)"
            >
              {{ getColumnMemberCaption(i, j) }}
            </div>
            <div
              class="col_dragAreaRight"
              @mousedown="onStartResize($event, i, 'columns')"
            ></div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-row overflow-hidden">
        <div class="rowsHeader_container" ref="rowsContainer">
          <div
            class="rowsHeader"
            v-for="(row, i) in rows"
            :key="i"
            :style="getRowHeaderStyle(i)"
          >
            <div
              v-if="i > 0"
              class="row_dragAreaTop"
              @mousedown="onStartResize($event, i - 1, 'rows')"
            ></div>
            <div
              v-for="(member, j) in row"
              :key="member.UNAME"
              class="rowMember"
              :style="getRowMemberStyle(i, j)"
            >
              {{ getRowMemberCaption(i, j) }}
            </div>
            <div
              class="row_dragAreaBottom"
              @mousedown="onStartResize($event, i, 'rows')"
            ></div>
          </div>
        </div>
        <div class="cells_container" @scroll="handleScroll">
          <div class="cell_row" v-for="(cellRow, j) in cellsParsed" :key="j">
            <div
              class="cell"
              v-for="(cell, i) in cellRow"
              :key="`${i}_${j}`"
              :style="getCellStyle(i, j)"
            >
              {{ getCellValue(cell) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.pivotTable_container {
  padding: v-bind(DEFAULT_ROW_HEIGHT);
  height: 100%;
}
.pivotTable {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.columnHeader_container {
  overflow: hidden;
  flex-shrink: 0;
}

.columnScroller {
  display: flex;
}

.columnHeader {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 0;
  line-height: v-bind(DEFAULT_ROW_HEIGHT);
  position: relative;
}

.columnHeader:last-child {
  border-right: 1px silver solid;
}

.columnMember {
  border-top: 1px silver solid;
  padding-left: 3px;
  font-weight: 600;
  height: v-bind(DEFAULT_ROW_HEIGHT);
  border-left: 1px silver solid;
}

.col_dragAreaLeft {
  position: absolute;
  height: 100%;
  width: 5px;
  left: 0;
  top: 0;
  cursor: ew-resize;
  z-index: 1;
}

.col_dragAreaRight {
  position: absolute;
  height: 100%;
  width: 5px;
  right: -1px;
  top: 0;
  cursor: ew-resize;
  z-index: 1;
}

.rowsHeader:last-child {
  border-bottom: 1px silver solid;
}

.rowsHeader {
  display: flex;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-right: 0;
  border-left: 0;
  height: v-bind(DEFAULT_ROW_HEIGHT);
  line-height: v-bind(DEFAULT_ROW_HEIGHT);
}

.row_dragAreaTop {
  position: absolute;
  width: 100%;
  height: 5px;
  left: 0;
  top: 0;
  cursor: ns-resize;
  z-index: 1;
}

.row_dragAreaBottom {
  position: absolute;
  height: 5px;
  width: 100%;
  bottom: -1px;
  left: 0;
  cursor: ns-resize;
  z-index: 1;
}

.rowMember {
  width: 150px;
  border-left: 1px silver solid;
  border-top: 1px silver solid;
  padding-left: 3px;
  font-weight: 600;
}

.cells_container {
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.cell_row {
  display: flex;
}

.cell {
  border: 1px silver solid;
  border-right: 0;
  border-bottom: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 0;
  width: 150px;
  height: v-bind(DEFAULT_ROW_HEIGHT);
  line-height: v-bind(DEFAULT_ROW_HEIGHT);
  padding-left: 3px;
}

.cell:last-child {
  border-right: 1px silver solid;
}

.cell_row:last-child > .cell {
  border-bottom: 1px silver solid;
}
</style>
