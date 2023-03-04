<script lang="ts">
import { usePivotTableStore } from "@/stores/PivotTable";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";

export default {
  setup() {
    const queryDesignerStore = useQueryDesignerStore();
    const pivotTableStore = usePivotTableStore();

    queryDesignerStore.$subscribe(
      () => {
        pivotTableStore.fetchPivotTableData();
      },
      { detached: true }
    );

    return {
      pivotTableStore,
      queryDesignerStore,
    };
  },
  computed: {
    columns() {
      return this.pivotTableStore.columns;
    },
    rows() {
      return this.pivotTableStore.rows;
    },
    cellsParsed() {
      if (!this.pivotTableStore.cells.length) return;
      if (
        !this.pivotTableStore.rows.length ||
        !this.pivotTableStore.columns.length
      ) {
        if (
          this.pivotTableStore.rows.length ===
          this.pivotTableStore.columns.length
        ) {
          return [this.pivotTableStore.cells];
        }
        return [];
      }

      const cp = [...this.pivotTableStore.cells];
      const result = [] as any[][];
      const colsArray = [];
      const count = this.pivotTableStore.rows.length;

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
  },
  methods: {
    getStylesForColumn(index: number) {
      return {
        width: "150px",
        height: "30px",
        "line-height": "30px",
        "padding-left": "3px",
        "border-left": index > 0 ? "none" : "",
      };
    },
    getColumnHeaderOffsetStyle() {
      return {
        "margin-left": `${150 - 1}px`,
        height: "30px",
      };
    },
    getStylesForRow(index: number) {
      return {
        width: "150px",
        height: "30px",
        "line-height": "30px",
        "padding-left": "3px",
        "border-top": index > 0 ? "none" : "",
      };
    },
    getStylesForCell() {
      const isOnlyCell =
        this.pivotTableStore.rows.length === 0 &&
        this.pivotTableStore.columns.length === 0;

      return {
        width: "150px",
        height: "30px",
        "line-height": "30px",
        "padding-left": "3px",
        "border-left": isOnlyCell ? "" : "none",
        "border-top": isOnlyCell ? "" : "none",
      };
    },
    getCellValue(cell: any) {
      if (typeof cell.FmtValue === "string") return cell.FmtValue;
      return "";
    },
    handleScroll(e: any) {
      (
        this.$refs.rowsContainer as HTMLElement
      ).style.transform = `translateY(-${e.target.scrollTop}px)`;
      (
        this.$refs.columnsContainer as HTMLElement
      ).style.transform = `translateX(-${e.target.scrollLeft}px)`;
    },
  },
};
</script>

<template>
  <div class="pivotTable_container">
    <!-- {{ queryDesignerStore.queryModel }} -->
    <div class="pivotTable">
      <div class="columnHeader_container" :style="getColumnHeaderOffsetStyle()">
        <div ref="columnsContainer" class="columnScroller">
          <div
            class="columnHeader"
            v-for="(column, i) in columns"
            :key="(column as any).Member.UNAME"
            :style="getStylesForColumn(i)"
          >
            {{ (column as any).Member.Caption }}
          </div>
        </div>
      </div>
      <div class="d-flex flex-row overflow-hidden">
        <div class="rowsHeader_container" ref="rowsContainer">
          <div
            class="rowsHeader"
            v-for="(row, i) in rows"
            :key="(row as any).Member.UNAME"
            :style="getStylesForRow(i)"
          >
            {{ (row as any).Member.Caption }}
          </div>
        </div>
        <div class="cells_container" @scroll="handleScroll">
          <div class="cell_row" v-for="(cellRow, i) in cellsParsed" :key="i">
            <div
              class="cell"
              v-for="(cell, j) in cellRow"
              :key="`${i}_${j}`"
              :style="getStylesForCell()"
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
  padding: 30px;
  height: 100%;
}
.pivotTable {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.columnHeader_container {
  margin-bottom: -1px;
  overflow: hidden;
  flex-shrink: 0;
}

.columnScroller {
  display: flex;
}

.columnHeader {
  display: inline-block;
  border: 1px silver solid;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 0;
}
.rowsHeader_container {
  margin-right: -1px;
}
.rowsHeader {
  border: 1px silver solid;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 0;
}
</style>
