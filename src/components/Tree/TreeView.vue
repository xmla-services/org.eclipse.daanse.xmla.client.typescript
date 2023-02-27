<script lang="ts">
import { useTreeViewDataStore } from "@/stores/TreeView";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { TreeItemTypesEnum } from "../../stores/TreeViewItems";
import { ref } from "vue";

export default {
  setup() {
    const store = useTreeViewDataStore();
    const appSettings = useAppSettingsStore();
    const filter = ref("");
    const triggerExpanded = (nodes: string[]) => {
      store.callExpandedMethods(nodes);
    };

    return {
      store,
      appSettings,
      filter,
      triggerExpanded,
      TreeItemTypesEnum,
    };
  },
};
</script>

<template>
  <div v-if="store.metadataLoaded">
    <h3 class="ma-2">Cube: {{ appSettings.selectedCube }}</h3>
    <div class="tree-container">
      <va-input
        v-model="filter"
        placeholder="Filter..."
        clearable
        class="filter-input"
      />
      <va-tree-view
        :nodes="store.treeViewNodes"
        class="customizable-content"
        :filter="filter"
        :text-by="'caption'"
        @update:expanded="triggerExpanded"
      >
        <template #content="node">
          <div
            v-if="node.type === TreeItemTypesEnum.Loading"
            class="d-flex align-center"
          >
            <va-progress-circle indeterminate size="small" />
          </div>
          <div class="d-flex align-center" draggable="true">
            {{ node.caption }}
          </div>
        </template>
      </va-tree-view>
    </div>
  </div>
  <div v-else class="progress-circle">
    <va-progress-circle indeterminate size="large" />
  </div>
</template>

<style lang="scss" scoped>
.progress-circle {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-input {
  width: 100%;
  padding: 0 1rem;
}
</style>
