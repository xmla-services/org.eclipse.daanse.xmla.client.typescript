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
import { computed, inject, ref, watch, type Ref } from "vue";
import MemberDropdown from "./MemberDropdown.vue";
import MemberPropertiesModal from "@/components/Modals/MemberPropertiesModal.vue";
import { useTreeViewDataStore } from "@/stores/TreeView";

const { state } = usePivotTableStore();

const DEFAULT_COLUMN_WIDTH = 150;
const MDDISPINFO_CHILD_COUNT = 65535;

const props = defineProps([
  "columns",
  "columnsStyles",
  "columnsOffset",
  "totalContentSize",
]);
const eventBus = inject("eventBus") as TinyEmitter;
const setParentStylesValue = inject("setColumnsStyles") as (
  index: number,
  styles: number
) => {};

const scrollPosition = ref(0);
const translate = ref(0);

const getColumnHeaderOffsetStyle = () => {
  return {
    "margin-left": `${props.columnsOffset}px`,
  };
};

const getColumnHeaderStyle = (i: number) => {
  return {
    width: `${props.columnsStyles[i] || DEFAULT_COLUMN_WIDTH}px`,
    transform: `translate(${translate.value}px, 0)`,
  };
};

let maxLevels = [] as number[];

watch(
  () => props.columns,
  () => {
    maxLevels = [];
    for (let i = 0; i < props.columns[0]?.length; i++) {
      for (let j = 0; j < props.columns.length; j++) {
        const level = parseInt(props.columns[j][i].LNum);
        if ((maxLevels[i] || 0) <= level) {
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

const getColChildCount = (i: number, j: number) => {
  const currentMember = props.columns?.[i]?.[j];
  return currentMember.DisplayInfo & MDDISPINFO_CHILD_COUNT;
};

const getColumnScrollerStyle = () => {
  return {
    transform: `translate(-${scrollPosition.value}px, 0)`,
  };
};

const hasChildrenDisplayed = (i: number, j: number) => {
  const currentMember = props.columns?.[i]?.[j];
  if (i + 1 === props.columns.length) return false;
  const currentHierarchyMembers = props.columns.map((e) => e[j]);

  if (
    currentHierarchyMembers.some(
      (e) => e.PARENT_UNIQUE_NAME === currentMember.UName
    )
  ) {
    return true;
  }
  return false;
};

const colIsExpanded = (i: number, j: number) => {
  const currentMember = props.columns?.[i]?.[j];

  return state.columnsExpandedMembers.some(
    (e) => e.UName === currentMember.UName
  );
};

const sameAsPrevious = (i: number, j: number) => {
  const currentMember = props.columns?.[i]?.[j];
  const prevMember = props.columns?.[i - 1]?.[j];

  if (!currentMember || !prevMember) return false;
  return currentMember.UName === prevMember.UName;
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

const expandFn = inject("expand") as Function;
const expand = (member: any) => {
  expandFn(member, "columns");
};

const collapseFn = inject("collapse") as Function;
const collapse = (member: any) => {
  collapseFn(member, "columns");
};

eventBus.on("onResize", onResize);
eventBus.on("onStopResize", onStopResize);
eventBus.on("scroll", ({ left }: { left: number }) => {
  scrollPosition.value = left;
  // requestAnimationFrame(() => {
  //   if (colsContaner.value) {
  //     colsContaner.value.style.transform = `translateX(-${scrollValue.value}px)`;
  //   }
  // });
});

const memberPropertiesModal = ref(null) as Ref<any>;
const openMemberProperties = async (member) => {
  const treeStore = useTreeViewDataStore();
  const level = treeStore.levels.find(
    (e) => e.LEVEL_UNIQUE_NAME === member.LName
  );
  await memberPropertiesModal.value?.run({ level, member });
};

const colsContaner = ref(null) as unknown as Ref<HTMLElement>;
const currentlyDisplayedValues = computed(() => {
  if (!colsContaner.value)
    return {
      data: [],
      translate: translate.value,
    };

  let translateValue = translate.value;
  let result = props.columns.map((columnMembers, i) => {
    return columnMembers.map((member) => {
      return {
        ...member,
        i,
      };
    });
  });

  const leftIndex = props.totalContentSize.xAxis.items.findIndex((e) => {
    const leftCoord = scrollPosition.value;
    if (e.start <= leftCoord && e.start + e.width > leftCoord) return true;
    return false;
  });
  let rightIndex = props.totalContentSize.xAxis.items.findIndex((e) => {
    const rightCoord = scrollPosition.value + colsContaner.value.clientWidth;

    if (e.start <= rightCoord && e.start + e.width >= rightCoord) return true;
    return false;
  });

  if (leftIndex >= 0 && rightIndex < 0)
    rightIndex = props.totalContentSize.xAxis.items.length - 1;

  if (leftIndex >= 0 && rightIndex > leftIndex) {
    result = result.slice(leftIndex, rightIndex + 1);
    translateValue = props.totalContentSize.xAxis.items[leftIndex].start;
  }

  return {
    data: result,
    translate: translateValue,
  };
});

watch(
  () => currentlyDisplayedValues.value,
  () => {
    translate.value = currentlyDisplayedValues.value.translate;
  }
);
</script>
<template>
  <div class="columnHeader_container" :style="getColumnHeaderOffsetStyle()">
    <Teleport to="body">
      <MemberPropertiesModal ref="memberPropertiesModal" />
    </Teleport>
    <div
      class="columnScroller"
      ref="colsContaner"
      :style="getColumnScrollerStyle()"
    >
      <div
        class="columnHeader"
        v-for="column in currentlyDisplayedValues.data"
        :key="column[0].i"
        :style="getColumnHeaderStyle(column[0].i)"
      >
        <MemberDropdown
          v-for="(member, j) in column"
          :key="member.UNAME"
          class="columnMemberWrapper"
          :drillupDisabled="member.LNum === '0'"
          @drilldown="drilldown(member)"
          @drillup="drillup(member)"
          @openMemberProperties="openMemberProperties(member)"
        >
          <template v-slot="{}">
            <div style="width: 100%">
              <div
                class="columnMember"
                :style="getColumnMemberStyle(member.i, j)"
              >
                <template v-if="!sameAsPrevious(member.i, j)">
                  <div
                    v-if="
                      getColChildCount(member.i, j) &&
                      !hasChildrenDisplayed(member.i, j)
                    "
                    class="expandIcon"
                  >
                    <va-icon
                      name="chevron_right"
                      size="small"
                      @click="expand(member)"
                    />
                  </div>
                  <div
                    v-else-if="
                      getColChildCount(member.i, j) &&
                      colIsExpanded(member.i, j)
                    "
                    class="expandIcon"
                  >
                    <va-icon
                      name="expand_more"
                      size="small"
                      @click="collapse(member)"
                    />
                  </div>
                </template>
                <div class="columnMemberHeader">
                  {{ getColumnMemberCaption(member.i, j) }}
                </div>
              </div>
              <div
                class="col_dragAreaRight"
                @mousedown="onStartResize($event, member.i)"
              ></div>
              <div
                v-if="member.i > 0"
                class="col_dragAreaLeft"
                @mousedown="onStartResize($event, member.i - 1)"
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

.columnMemberWrapper {
  height: 100%;
}

.columnMember {
  display: flex;
  border-top: 1px silver solid;
  padding-left: 3px;
  border-left: 1px silver solid;
  width: 100%;
  height: 100%;
}

.columnMemberHeader {
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
