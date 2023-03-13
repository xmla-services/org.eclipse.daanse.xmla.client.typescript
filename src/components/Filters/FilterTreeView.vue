<script lang="ts" setup>
import { useFilterTreeDataSource } from "@/composables/filterTreeDataSource";
import { useSearchResultTreeData } from "@/composables/searchResultTreeData";

import { ref, watch } from "vue";

const props = defineProps(["rootHierarchy"]);
const emit = defineEmits(["setSelection"]);

const {
  tree,
  triggerExpanded,
  selectAll,
  selectedItems,
  deselectedItems,
  changeSelection,
  setSelectAll,
} = await useFilterTreeDataSource(props.rootHierarchy);
const {
  filteredTree,
  levels,
  searchBy,
  searchValue,
  triggerExpandedWithSearch,
} = await useSearchResultTreeData(props.rootHierarchy);

const selectedNodes = ref([]);
const multipleChoise = ref(
  props.rootHierarchy.filters
    ? props.rootHierarchy.filters.multipleChoise
    : false
);
const singleSelection = ref({ id: null });

const emitSelectFunc = () => {
  emit("setSelection", {
    enabled: true,
    multipleChoise: multipleChoise.value,
    selectedItem: singleSelection.value,
    selectAll: selectAll.value,
    deselectedItems: deselectedItems.value,
    selectedItems: selectedItems.value,
  });
};

watch(selectAll, emitSelectFunc);
watch(selectedItems, emitSelectFunc);
watch(deselectedItems, emitSelectFunc);
watch(singleSelection, emitSelectFunc);

const selectFilter = function (e: any) {
  singleSelection.value = e;
};
</script>
<template>
  <div class="d-flex" style="flex-direction: column; width: 100%">
    <div class="d-flex">
      <va-input
        v-model="searchValue"
        class="mr-3"
        placeholder="Search value"
        style="width: 100%"
      />
      <va-select
        v-model="searchBy"
        label="Search by"
        :options="levels"
        value-by="LEVEL_UNIQUE_NAME"
        text-by="LEVEL_CAPTION"
        prevent-overflow
      />
    </div>
    <div class="mt-3 mb-2">
      <va-checkbox
        v-model="multipleChoise"
        label="Select Multiple Items"
        left-label
      />
    </div>
    <div class="mb-3" style="overflow: auto; height: 100%">
      <template v-if="multipleChoise">
        <template v-if="!selectedItems.length && !deselectedItems.length">
          <va-checkbox
            class="mt-3 ml-2"
            v-model="selectAll"
            label="Select all"
          />
        </template>
        <template v-else>
          <va-checkbox
            class="mt-3 ml-2"
            :model-value="true"
            label="Select all"
            checked-icon="remove"
            @click.prevent.stop="setSelectAll"
          />
        </template>
      </template>
      <va-tree-view
        class="filter-tree-view"
        :nodes="searchValue ? filteredTree : tree"
        @update:expanded="
          searchValue
            ? triggerExpandedWithSearch($event)
            : triggerExpanded($event)
        "
        v-model:checked="selectedNodes"
      >
        <template #content="node">
          <div v-if="node.isLoading" class="d-flex align-center">
            <va-progress-circle indeterminate size="small" />
          </div>
          <div
            v-else
            class="d-flex"
            style="align-items: center"
            :style="
              !multipleChoise && node.id === singleSelection.id
                ? `border-bottom: 1px solid var(--va-primary);`
                : 'border-bottom: 1px solid transparent'
            "
            @click.stop.prevent="selectFilter(node)"
          >
            <template v-if="multipleChoise && !node.partiallySelected">
              <va-checkbox
                class="mr-2"
                :model-value="node.selected"
                @click.stop.prevent="changeSelection(node)"
              />
            </template>
            <template v-else-if="multipleChoise && node.partiallySelected">
              <va-checkbox
                class="mr-2"
                :model-value="true"
                checked-icon="remove"
                @click.stop.prevent="changeSelection(node)"
              />
            </template>
            <div style="width: 100%">{{ node.Caption }}</div>
            <va-icon
              v-if="!multipleChoise && node.id === singleSelection.id"
              class="ml-2"
              name="check"
              color="primary"
              size="small"
            />
          </div>
        </template>
      </va-tree-view>
    </div>
  </div>
</template>
<style lang="scss">
.filter-tree-view {
  .va-tree-node-root {
    padding-top: 0;
    padding-bottom: 0;
  }

  .va-tree-node-content__body > div {
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
</style>
