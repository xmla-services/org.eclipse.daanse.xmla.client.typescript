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
import { inject, ref, watch } from "vue";
import MemberDropdown from "./MemberDropdown.vue";

const DEFAULT_COLUMN_WIDTH = 150;
const DEFAULT_ROW_HEIGHT = 30;

// const DEFAULT_COLUMN_WIDTH_CSS = `${150}px`;
const DEFAULT_ROW_HEIGHT_CSS = `${DEFAULT_ROW_HEIGHT}px`;

const props = defineProps(["columns", "columnsStyles", "columnsOffset"]);
const eventBus = inject("eventBus") as TinyEmitter;
const setParentStylesValue = inject("setColumnsStyles") as (
  index: number,
  styles: number
) => {};

const scrollValue = ref(0);

const colsContaner = ref(null as null | HTMLElement);

const getColumnHeaderOffsetStyle = () => {
  return {
    "margin-left": `${props.columnsOffset}px`,
  };
};

const getColumnHeaderStyle = (i: number) => {
  return {
    width: `${props.columnsStyles[i] || DEFAULT_COLUMN_WIDTH}px`,
  };
};

let maxLevels = [] as number[];

watch(
  () => props.columns,
  () => {
    for (let i = 0; i < props.columns[0]?.length; i++) {
      for (let j = 0; j < props.columns.length; j++) {
        const level = parseInt(props.columns[j][i].LNum);
        if (maxLevels[i] || 0 <= level) {
          maxLevels[i] = level;
        }
      }
    }
  }
);

const getColumnMemberStyle = (i: number, j: number) => {
  const currentMember = props.columns?.[i]?.[j];
  const nextMember = props.columns?.[i - 1]?.[j];

  const styles = {} as { [key: string]: string };
  styles["padding-top"] = `${currentMember.LNum * 5 + 5}px`;
  styles["height"] = `${30 + maxLevels[j] * 5}px`;

  if (!currentMember || !nextMember) return styles;

  if (currentMember.UName === nextMember.UName) {
    styles["border-left"] = "none";
  }
  return styles;
};

const getColumnMemberCaption = (i: number, j: number) => {
  const currentMember = props.columns?.[i]?.[j];
  const nextMember = props.columns?.[i - 1]?.[j];
  if (!currentMember || !nextMember) return currentMember.Caption;
  if (currentMember.UName === nextMember.UName) {
    return "";
  }
  return currentMember.Caption;
};

let resizeInProg = false;
let itemResized: number = -1;

const onStartResize = (e: MouseEvent, i: number) => {
  if (e.button === 0) {
    itemResized = i;
    resizeInProg = true;
  }
};
const onStopResize = () => {
  resizeInProg = false;
};
const onResize = (e: MouseEvent) => {
  if (resizeInProg) {
    const rowStyles =
      (props.columnsStyles[itemResized] || DEFAULT_COLUMN_WIDTH) + e.movementX;
    setParentStylesValue(itemResized, rowStyles);
  }
};

const drilldownFn = inject("drilldown") as Function;
const drilldown = (member: any) => {
  drilldownFn(member, "columns");
};

const drillupFn = inject("drillup") as Function;
const drillup = (member: any) => {
  drillupFn(member, "columns");
};

eventBus.on("onResize", onResize);
eventBus.on("onStopResize", onStopResize);
eventBus.on("scroll", ({ left }: { left: number }) => {
  scrollValue.value = left;
  requestAnimationFrame(() => {
    if (colsContaner.value) {
      colsContaner.value.style.transform = `translateX(-${scrollValue.value}px)`;
    }
  });
});
</script>
<template>
  <div class="columnHeader_container" :style="getColumnHeaderOffsetStyle()">
    <div
      class="columnScroller"
      :style="getColumnHeaderStyle"
      ref="colsContaner"
    >
      <div
        class="columnHeader"
        v-for="(column, i) in columns"
        :key="i"
        :style="getColumnHeaderStyle(i)"
      >
        <MemberDropdown
          v-for="(member, j) in column"
          :key="member.UNAME"
          :drillupDisabled="member.LNum === '0'"
          @drilldown="drilldown(member)"
          @drillup="drillup(member)"
        >
          <template v-slot="{}">
            <div style="width: 100%">
              <div class="columnMember" :style="getColumnMemberStyle(i, j)">
                {{ getColumnMemberCaption(i, j) }}
              </div>
              <div
                class="col_dragAreaRight"
                @mousedown="onStartResize($event, i)"
              ></div>
              <div
                v-if="i > 0"
                class="col_dragAreaLeft"
                @mousedown="onStartResize($event, i - 1)"
              ></div>
            </div>
          </template>
        </MemberDropdown>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.columnHeader_container {
  overflow: hidden;
  flex-shrink: 0;
}

.columnScroller {
  display: flex;
}

.columnHeader {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: column;
}

.columnHeader:last-child {
  border-right: 1px silver solid;
}

.columnMember {
  border-top: 1px silver solid;
  padding-left: 3px;
  font-weight: 600;
  border-left: 1px silver solid;
  width: 100%;
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
</style>
