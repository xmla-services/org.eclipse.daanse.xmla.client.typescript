<script lang="ts">
import { usePivotTableStore } from "@/stores/PivotTable";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";
import { optionalArrayToArray } from "@/utils/helpers";

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
      const cols = this.pivotTableStore.columns.map((e: { Member: any }) => {
        return optionalArrayToArray(e.Member);
      });

      return cols;
    },
    rows() {
      const rows = this.pivotTableStore.rows.map((e: { Member: any }) => {
        return optionalArrayToArray(e.Member);
      });

      return rows;
      // return this.pivotTableStore.rows;
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
        "margin-left": `${this.rows?.[0]?.length * 150}px`,
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
          <div class="columnHeader" v-for="(column, i) in columns" :key="i">
            <div
              v-for="(member, j) in column"
              :key="member.UNAME"
              class="columnMember"
              :style="getColumnMemberStyle(i, j)"
            >
              {{ getColumnMemberCaption(i, j) }}
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-row overflow-hidden">
        <div class="rowsHeader_container" ref="rowsContainer">
          <div class="rowsHeader" v-for="(row, i) in rows" :key="i">
            <div
              v-for="(member, j) in row"
              :key="member.UNAME"
              class="rowMember"
              :style="getRowMemberStyle(i, j)"
            >
              {{ getRowMemberCaption(i, j) }}
            </div>
          </div>
        </div>
        <div class="cells_container" @scroll="handleScroll">
          <div class="cell_row" v-for="(cellRow, i) in cellsParsed" :key="i">
            <div class="cell" v-for="(cell, j) in cellRow" :key="`${i}_${j}`">
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
  width: 150px;
  line-height: 30px;
}

.columnHeader:last-child {
  border-right: 1px silver solid;
}

.columnMember {
  border-top: 1px silver solid;
  padding-left: 3px;
  font-weight: 600;
  height: 30px;
  border-left: 1px silver solid;
}

.rowsHeader_container {
  border-bottom: 1px silver solid;
}
.rowsHeader {
  display: flex;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-right: 0;
  border-left: 0;
  height: 30px;
  line-height: 30px;
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
  border-bottom: 1px silver solid;
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
  height: 30px;
  line-height: 30px;
  padding-left: 3px;
}

.cell:last-child {
  border-right: 1px silver solid;
}
</style>
