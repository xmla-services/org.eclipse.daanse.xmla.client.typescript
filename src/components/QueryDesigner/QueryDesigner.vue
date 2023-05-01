<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts">
import { useQueryDesignerStore } from "@/stores/QueryDesigner";
import type {
  HierarchyTreeItem,
  MeasureTreeItem,
} from "@/stores/TreeViewItems";
import { ref } from "vue";
import draggable from "vuedraggable";
import FilterModal from "../Modals/FilterModal.vue";

export default {
  setup() {
    const queryDesignerStore = useQueryDesignerStore();
    const addedOperationCache = ref({
      area: "filters" as "rows" | "columns" | "filters",
      e: null,
      hasCache: false,
      cancelRemoving: false,
    });

    return {
      queryDesignerStore,
      addedOperationCache,
    };
  },
  methods: {
    changeItems(area: "rows" | "columns" | "filters", e: any) {
      const { added, moved, removed } = e;
      if (added) {
        if (area === "filters") {
          if (added.element.type === "Values") {
            this.addedOperationCache.cancelRemoving = true;
            return;
          }
        }

        const element: HierarchyTreeItem = added.element;
        const newIndex = added.newIndex;
        const duplicate = this.queryDesignerStore.hierarchyUniqueNames.find(
          (e) => e === element.originalItem.HIERARCHY_UNIQUE_NAME
        );
        const areaContent = this.queryDesignerStore[area];

        if (duplicate) {
          this.addedOperationCache.e = e;
          this.addedOperationCache.area = area;
          this.addedOperationCache.hasCache = true;
          return;
        }

        const arrayBefore = areaContent.slice(0, newIndex);
        const arrayAfter = areaContent.slice(newIndex);
        const newElement: HierarchyTreeItem = {
          originalItem: element.originalItem,
          id: element.id,
          caption: element.caption,
          children: [],
          type: element.type,
          filters: element.filters || {
            enabled: false,
          },
        };

        this.queryDesignerStore[area] = [
          ...(arrayBefore as HierarchyTreeItem[]),
          newElement,
          ...(arrayAfter as HierarchyTreeItem[]),
        ];
      }
      // Event only occurs when moving item from one area to another
      if (removed) {
        if (this.addedOperationCache.cancelRemoving) {
          this.addedOperationCache.cancelRemoving = false;
          return;
        }

        const areaContent = this.queryDesignerStore[area];
        const index = areaContent.findIndex((e) => e.id === removed.element.id);
        areaContent.splice(index, 1);

        //In "vuedraggable" removing event occurs after adding. We cache adding operation to be performed later, after item is removed from other section.
        if (this.addedOperationCache.hasCache) {
          this.addedOperationCache.hasCache = false;
          this.changeItems(
            this.addedOperationCache.area,
            this.addedOperationCache.e
          );
        }
      }
      if (moved) {
        const { element, newIndex, oldIndex } = moved;
        const areaContent = this.queryDesignerStore[area];

        if (newIndex < oldIndex) {
          const arrayBefore = areaContent.slice(0, newIndex);
          const arrayAfter = areaContent.slice(newIndex);
          const index = arrayAfter.findIndex((e) => e.id === element.id);
          arrayAfter.splice(index, 1);

          this.queryDesignerStore[area] = [
            ...arrayBefore,
            element,
            ...arrayAfter,
          ];
        } else {
          const arrayBefore = areaContent.slice(0, newIndex + 1);
          const arrayAfter = areaContent.slice(newIndex + 1);
          const index = arrayBefore.findIndex((e) => e.id === element.id);
          arrayBefore.splice(index, 1);

          this.queryDesignerStore[area] = [
            ...arrayBefore,
            element,
            ...arrayAfter,
          ];
        }
      }
    },
    changeMeasures(event: any) {
      const { added, moved } = event;
      if (added) {
        const element: MeasureTreeItem = added.element;
        const newIndex = added.newIndex;
        const duplicate = this.queryDesignerStore.measures.find(
          (e) =>
            e.originalItem.MEASURE_UNIQUE_NAME ===
            element.originalItem.MEASURE_UNIQUE_NAME
        );
        const areaContent = this.queryDesignerStore.measures;

        if (duplicate) {
          return;
        }
        if (this.queryDesignerStore.measures.length === 1) {
          this.queryDesignerStore.columns.push({
            type: "Values",
            id: "Values",
            children: [],
            caption: "Values",
            originalItem: {
              HIERARCHY_UNIQUE_NAME: "Values",
            },
            filters: null,
          });
        }

        const arrayBefore = areaContent.slice(0, newIndex);
        const arrayAfter = areaContent.slice(newIndex);
        const newElement = {
          originalItem: element.originalItem,
          id: element.id,
          caption: element.caption,
          children: [],
          type: element.type,
        };

        this.queryDesignerStore.measures = [
          ...arrayBefore,
          newElement,
          ...arrayAfter,
        ];
      }

      if (moved) {
        const { element, newIndex, oldIndex } = moved;
        const areaContent = this.queryDesignerStore.measures;

        if (newIndex < oldIndex) {
          const arrayBefore = areaContent.slice(0, newIndex);
          const arrayAfter = areaContent.slice(newIndex);
          const index = arrayAfter.findIndex((e) => e.id === element.id);
          arrayAfter.splice(index, 1);

          this.queryDesignerStore.measures = [
            ...arrayBefore,
            element,
            ...arrayAfter,
          ];
        } else {
          const arrayBefore = areaContent.slice(0, newIndex + 1);
          const arrayAfter = areaContent.slice(newIndex + 1);
          const index = arrayBefore.findIndex((e) => e.id === element.id);
          arrayBefore.splice(index, 1);

          this.queryDesignerStore.measures = [
            ...arrayBefore,
            element,
            ...arrayAfter,
          ];
        }
      }
    },
    remove(
      area: "rows" | "columns" | "filters" | "measures",
      item: any,
      event: any
    ) {
      if (!event) {
        const areaContent = this.queryDesignerStore[area];
        const index = areaContent.findIndex((e) => e.id === item.id);

        if (area === "measures") {
          if (areaContent.length === 2) {
            this.queryDesignerStore["rows"] = this.queryDesignerStore[
              "rows"
            ].filter((e) => (e as any).type !== "Values");
            this.queryDesignerStore["columns"] = this.queryDesignerStore[
              "columns"
            ].filter((e) => (e as any).type !== "Values");
          }
        }
        if (index >= 0) {
          areaContent.splice(index, 1);
        }
      }
    },
    async configureFilter(area: "rows" | "columns" | "filters", element: any) {
      const originalItem = this.queryDesignerStore[area].find(
        (e) => e.id === element.id
      );
      const filterModal: any = this.$refs.filterModal;
      const { filters } = await filterModal.run({
        element,
        filters: element.filters,
      });
      if (!filters) return;
      if (originalItem) {
        originalItem.filters = filters;
      }
    },
  },
  components: {
    draggable,
    FilterModal,
  },
  computed: {
    filters() {
      return [...this.queryDesignerStore.filters];
    },
    columns() {
      return [...this.queryDesignerStore.columns];
    },
    rows() {
      return [...this.queryDesignerStore.rows];
    },
    measures() {
      return [...this.queryDesignerStore.measures];
    },
  },
};
</script>

<template>
  <div class="queryDesigner">
    <div>
      <div class="update_container mb-2">
        <va-checkbox
          class="mr-2"
          v-model="queryDesignerStore.manualUpdate"
          label="Manually update layout"
        />
        <va-button>Update</va-button>
      </div>
    </div>
    <div class="areas">
      <div class="queryDesignerArea">
        <div class="va-title">Filters</div>
        <div class="queryDesingnerArea_container">
          <draggable
            class="dragArea list-group"
            :list="filters"
            group="hierarchies"
            @change="changeItems('filters', $event)"
            item-key="id"
          >
            <template #item="{ element }">
              <va-chip
                :model-value="true"
                closeable
                @update:model-value="remove('filters', element, $event)"
              >
                <div class="d-flex chip_caption">
                  <span class="chip_caption_text">
                    {{ element.caption }}
                  </span>
                  <va-icon
                    class="filter-icon ml-2"
                    name="filter_list"
                    size="small"
                    :style="{
                      color: element.filters.enabled ? 'lime' : '',
                    }"
                    @click="configureFilter('filters', element)"
                  />
                </div>
              </va-chip>
            </template>
          </draggable>
        </div>
      </div>
      <div class="queryDesignerArea">
        <div class="va-title">Columns</div>
        <div class="queryDesingnerArea_container">
          <draggable
            class="dragArea list-group"
            :list="columns"
            group="hierarchies"
            @change="changeItems('columns', $event)"
            item-key="id"
          >
            <template #item="{ element }">
              <va-chip
                :model-value="true"
                :closeable="element.type !== 'Values'"
                @update:model-value="remove('columns', element, $event)"
              >
                <div class="d-flex chip_caption">
                  <span class="chip_caption_text">
                    {{ element.caption }}
                  </span>
                  <va-icon
                    v-if="element.type !== 'Values'"
                    class="filter-icon ml-2"
                    name="filter_list"
                    size="small"
                    :style="{
                      color: element.filters.enabled ? 'lime' : '',
                    }"
                    @click="configureFilter('columns', element)"
                  />
                </div>
              </va-chip>
            </template>
          </draggable>
        </div>
      </div>
      <div class="queryDesignerArea">
        <div class="va-title">Rows</div>
        <div class="queryDesingnerArea_container">
          <draggable
            class="dragArea list-group"
            :list="rows"
            group="hierarchies"
            @change="changeItems('rows', $event)"
            item-key="id"
          >
            <template #item="{ element }">
              <va-chip
                :model-value="true"
                :closeable="element.type !== 'Values'"
                @update:model-value="remove('rows', element, $event)"
              >
                <div class="d-flex chip_caption">
                  <span class="chip_caption_text">
                    {{ element.caption }}
                  </span>
                  <va-icon
                    v-if="element.type !== 'Values'"
                    class="filter-icon ml-2"
                    name="filter_list"
                    size="small"
                    :style="{
                      color: element.filters.enabled ? 'lime' : '',
                    }"
                    @click="configureFilter('rows', element)"
                  />
                </div>
              </va-chip>
            </template>
          </draggable>
        </div>
      </div>
      <div class="queryDesignerArea">
        <div class="va-title">Data</div>
        <div class="queryDesingnerArea_container">
          <draggable
            class="dragArea list-group"
            :list="measures"
            group="measures"
            @change="changeMeasures($event)"
            item-key="id"
          >
            <template #item="{ element }">
              <va-chip
                :model-value="true"
                closeable
                @update:model-value="remove('measures', element, $event)"
              >
                {{ element.caption }}
              </va-chip>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <FilterModal ref="filterModal" />
  </div>
</template>

<style lang="scss">
.queryDesigner {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;

  padding: 1rem;

  .update_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .areas {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .queryDesignerArea {
      display: flex;
      flex-direction: column;
      height: 100%;

      .queryDesingnerArea_container {
        height: 100%;
        width: 100%;

        border: 1px solid #9ea3ac;
        margin: 0.25rem 0 1rem;

        .list-group {
          height: 100%;
          width: 100%;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          align-items: baseline;

          --va-chip-content-display: inline;

          .va-chip {
            max-width: 100%;
          }

          .va-chip__content {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          div.sortable-ghost {
            border: var(--va-chip-border, var(--va-control-border));
            position: var(--va-chip-position);
            border-radius: var(--va-chip-border-radius);
            width: var(--va-chip-width);
            height: var(--va-chip-height);
            min-width: var(--va-chip-min-width);
            min-height: var(--va-chip-min-height);
            padding: 0 0.6rem;
            cursor: var(--va-chip-cursor);
            font-size: var(--va-chip-font-size);
            font-family: var(--va-font-family);
            vertical-align: var(--va-chip-vertical-align);
            color: rgb(255, 255, 255);
            background: #4e81e9;
            line-height: var(--va-chip-content-line-height);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            display: inline;
          }

          .chip_caption {
            width: 100%;

            .chip_caption_text {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .filter-icon {
              cursor: pointer;
              line-height: var(--va-chip-content-line-height) !important;
            }
          }
        }
      }
    }
  }
}

.split.vertical .queryDesigner {
  .areas {
    flex-direction: row;
    flex-wrap: wrap;

    .queryDesignerArea {
      width: 50%;
      height: 50%;
      padding: 5px;
    }
  }
}
</style>
