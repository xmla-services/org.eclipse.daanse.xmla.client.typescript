<script lang="ts">
import { useTreeViewDataStore } from "@/stores/TreeView";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { TreeItemTypesEnum } from "../../stores/TreeViewItems";
import { ref } from "vue";
import draggable from "vuedraggable";

export default {
  setup() {
    const store = useTreeViewDataStore();
    const appSettings = useAppSettingsStore();
    const filter = ref("");
    const triggerExpanded = (nodes: string[]) => {
      store.callExpandedMethods(nodes);
    };
    const dragging = ref("");

    return {
      store,
      appSettings,
      filter,
      triggerExpanded,
      TreeItemTypesEnum,
      dragging,
    };
  },
  components: {
    draggable,
  },
};
</script>

<template>
  <div v-if="store.metadataLoaded" style="height: 100%">
    <div class="tree-container">
      <div class="tree-header mb-2">
        <h3 class="ma-2">Cube: {{ appSettings.selectedCube }}</h3>
        <va-input
          v-model="filter"
          placeholder="Filter..."
          clearable
          class="filter-input"
        />
      </div>
      <va-tree-view
        :nodes="store.treeViewNodes"
        class="tree-view"
        :filter="filter"
        :text-by="'caption'"
        @update:expanded="triggerExpanded"
      >
        <template #content="node">
          <draggable
            v-if="node.type === TreeItemTypesEnum.Hierarchy"
            :modelValue="[node]"
            :group="{ name: 'hierarchies', pull: 'clone', put: false }"
            item-key="id"
          >
            <template #item="{ element }">
              <div>
                {{ element.caption }}
              </div>
            </template>
          </draggable>
          <draggable
            v-else-if="node.type === TreeItemTypesEnum.Measure"
            :modelValue="[node]"
            :group="{ name: 'measures', pull: 'clone', put: false }"
            item-key="id"
          >
            <template #item="{ element }">
              <div>
                {{ element.caption }}
              </div>
            </template>
          </draggable>
          <div
            v-else-if="node.type === TreeItemTypesEnum.Loading"
            class="d-flex align-center"
          >
            <va-progress-circle indeterminate size="small" />
          </div>
          <div
            v-else-if="node.type === TreeItemTypesEnum.LoadMore"
            class="d-flex align-center"
          >
            <va-button @click="node.onClick()">Load more</va-button>
          </div>
          <div v-else class="d-flex align-center">
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
.tree-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .tree-view {
    overflow: auto;
  }
}

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
