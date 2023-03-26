<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
import type { TinyEmitter } from "tiny-emitter";
import { inject } from "vue";

const props = defineProps(["cells", "rowsStyles", "colsStyles"]);

const DEFAULT_COLUMN_WIDTH = 150;
const DEFAULT_ROW_HEIGHT = 30;
const DEFAULT_ROW_HEIGHT_CSS = `${DEFAULT_ROW_HEIGHT}px`;
const eventBus = inject("eventBus") as TinyEmitter;

const handleScroll = (e: any) => {
  eventBus.emit("scroll", {
    top: e.target.scrollTop,
    left: e.target.scrollLeft,
  });
};

const getCellStyle = (i: number, j: number) => {
  return {
    width: `${props.colsStyles[i] || DEFAULT_COLUMN_WIDTH}px`,
    height: `${props.rowsStyles[j] || DEFAULT_ROW_HEIGHT}px`,
  };
};

const getCellValue = (cell: any) => {
  if (typeof cell.FmtValue === "string") return cell.FmtValue;
  return cell.Value;
};
</script>
<template>
  <div class="cells_container" @scroll="handleScroll">
    <div class="cell_row" v-for="(cellRow, j) in cells" :key="j">
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
</template>
<style>
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
  height: v-bind(DEFAULT_ROW_HEIGHT_CSS);
  line-height: v-bind(DEFAULT_ROW_HEIGHT_CSS);
  padding-left: 3px;
}

.cell:last-child {
  border-right: 1px silver solid;
}

.cell_row:last-child > .cell {
  border-bottom: 1px silver solid;
}
</style>
