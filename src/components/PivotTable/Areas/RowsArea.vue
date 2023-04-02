<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
import { usePivotTableStore } from "@/stores/PivotTable";
import type { TinyEmitter } from "tiny-emitter";
import { inject, ref } from "vue";
import MemberDropdown from "./MemberDropdown.vue";

const { state } = usePivotTableStore();

const DEFAULT_ROW_HEIGHT = 30;
const DEFAULT_ROW_HEIGHT_CSS = `${DEFAULT_ROW_HEIGHT}px`;
const MDDISPINFO_CHILD_COUNT = 65535;
const MDDISPINFO_DRILLED_DOWN = 65536;

const props = defineProps(["rows", "rowsStyles"]);
const eventBus = inject("eventBus") as TinyEmitter;
const setParentStylesValue = inject("setRowsStyles") as (
  index: number,
  styles: number
) => {};

const scrollValue = ref(0);

const getRowMemberCaption = (i: number, j: number) => {
  const currentMember = props.rows?.[i]?.[j];
  const nextMember = props.rows?.[i - 1]?.[j];

  if (!currentMember || !nextMember) return currentMember.Caption;

  if (currentMember.UName === nextMember.UName) {
    return "";
  }
  return currentMember.Caption;
};

const getRowsHeaderContainerStyle = () => {
  return {
    // transform: `translateY(-${scrollValue.value}px)`,
  };
};

const rowsContainer = ref(null as null | HTMLElement);

const getRowMemberStyle = (i: number, j: number) => {
  const currentMember = props.rows?.[i]?.[j];
  const nextMember = props.rows?.[i - 1]?.[j];

  const styles = {} as { [key: string]: string };
  styles["padding-left"] = `${currentMember.LNum * 15 + 5}px`;

  if (!currentMember || !nextMember) return styles;

  if (currentMember.UName === nextMember.UName) {
    styles["border-top"] = "none";
  }
  return styles;
};

const getRowHeaderStyle = (i: number) => {
  return {
    height: `${props.rowsStyles[i] || DEFAULT_ROW_HEIGHT}px`,
  };
};

const getRowChildCount = (i: number, j: number) => {
  const currentMember = props.rows?.[i]?.[j];
  return  currentMember.DisplayInfo & MDDISPINFO_CHILD_COUNT;
}

const hasChildrenDisplayed = (i: number, j: number) => {
  const currentMember = props.rows?.[i]?.[j];
  if (i + 1 === props.rows.length) return false;
  const currentHierarchyMembers = props.rows.map((e) => e[j]);

  if (currentHierarchyMembers.some((e) => e.PARENT_UNIQUE_NAME === currentMember.UName)) {
    return true;
  }
  return false;
}

const rowIsExpanded = (i: number, j: number) => {
  const currentMember = props.rows?.[i]?.[j];
  
  return state.rowsExpandedMembers.some(e => e.UName === currentMember.UName);
}

const sameAsPrevious = (i: number, j: number) => {
  const currentMember = props.rows?.[i]?.[j];
  const prevMember = props.rows?.[i - 1]?.[j];
  
  if (!currentMember || !prevMember) return false;
  return currentMember.UName === prevMember.UName;
}

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
      (props.rowsStyles[itemResized] || DEFAULT_ROW_HEIGHT) + e.movementY;
    setParentStylesValue(itemResized, rowStyles);
  }
};

const drilldownFn = inject("drilldown") as Function;
const drilldown = (member: any) => {
  drilldownFn(member, "rows");
};

const drillupFn = inject("drillup") as Function;
const drillup = (member: any) => {
  drillupFn(member, "rows");
};

const expandFn = inject("expand") as Function;
const expand = (member: any) => {
  expandFn(member, "rows");
}

const collapseFn = inject("collapse") as Function;
const collapse = (member: any) => {
  collapseFn(member, "rows");
}

eventBus.on("onResize", onResize);
eventBus.on("onStopResize", onStopResize);

eventBus.on("scroll", ({ top }: { top: number }) => {
  scrollValue.value = top;
  requestAnimationFrame(() => {
    if (rowsContainer.value) {
      rowsContainer.value.style.transform = `translateY(-${scrollValue.value}px)`;
    }
  });
});
</script>
<template>
  <div
    class="rowsHeader_container"
    :style="getRowsHeaderContainerStyle()"
    ref="rowsContainer"
  >
    <div
      class="rowsHeader"
      v-for="(row, i) in rows"
      :key="i"
      :style="getRowHeaderStyle(i)"
    >
      <MemberDropdown
        v-for="(member, j) in row"
        :key="member.UNAME"
        @drilldown="drilldown(member)"
        @drillup="drillup(member)"
      >
        <template v-slot="{}">
          <div>
            <div class="rowMember" :style="getRowMemberStyle(i, j)">
              <template v-if="!sameAsPrevious(i, j)">
                <div v-if="getRowChildCount(i, j) && !hasChildrenDisplayed(i, j)" class="expandIcon">
                  <va-icon
                    name="chevron_right"
                    size="small"
                    @click="expand(member)"
                  />
                </div>
                <div v-else-if="getRowChildCount(i, j) && rowIsExpanded(i, j)" class="expandIcon">
                  <va-icon
                    name="expand_more"
                    size="small"
                    @click="collapse(member)"
                  />
                </div>
              </template>
              <div class="rowMemberCaption">
                {{ getRowMemberCaption(i, j) }}
              </div>
            </div>
            <div
              class="row_dragAreaBottom"
              @mousedown="onStartResize($event, i)"
            ></div>
            <div
              v-if="i > 0"
              class="row_dragAreaTop"
              @mousedown="onStartResize($event, i - 1)"
            ></div>
          </div>
        </template>
      </MemberDropdown>
    </div>
  </div>
</template>
<style>
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
  height: v-bind(DEFAULT_ROW_HEIGHT_CSS);
  line-height: v-bind(DEFAULT_ROW_HEIGHT_CSS);
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
  display: flex;
  width: 150px;
  border-left: 1px silver solid;
  border-top: 1px silver solid;
  padding-left: 3px;
  align-items: flex-start;
  padding-top: 5px;
}

.rowMemberCaption {
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 100%;
}

.expandIcon {
  flex-grow: 0;
}
</style>
