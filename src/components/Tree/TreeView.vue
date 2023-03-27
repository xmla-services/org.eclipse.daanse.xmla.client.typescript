<script lang="ts">
import { useTreeViewDataStore } from "@/stores/TreeView";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { TreeItemTypesEnum } from "../../stores/TreeViewItems";
import { ref } from "vue";
import draggable from "vuedraggable";
import XMLAIconVue from "@/icons/XMLAIcon.vue";

export default {
  setup() {
    const store = useTreeViewDataStore();
    const appSettings = useAppSettingsStore();
    const filter = ref("");
    const expandedNodes = ref([] as string[]);
    const triggerExpanded = (nodes: string[]) => {
      expandedNodes.value = nodes;
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
      expandedNodes,
    };
  },
  components: {
    draggable,
    XMLAIconVue,
  },
  methods: {
    getTreeViewItemIcon(treeViewItem) {
      const iconDesc = {
        name: "",
        primaryColor: "",
        secondaryColor: "",
      }
      if (treeViewItem.type === TreeItemTypesEnum.Measure) {
        iconDesc.name = "MeasureIcon";
      }
      else if (treeViewItem.type === TreeItemTypesEnum.SetsFolder || treeViewItem.type === TreeItemTypesEnum.Folder) {
        if (this.expandedNodes.some((e) => e === treeViewItem.id)) {
          iconDesc.name = "mdi-folder_open";
        } else {
          iconDesc.name = "mdi-folder";
        }
      }
      else if (treeViewItem.type === TreeItemTypesEnum.Set) {
        iconDesc.name = "SetIcon";
      }
      else if (treeViewItem.type === TreeItemTypesEnum.Dimension) {
        if (treeViewItem.isMeasureDimension) {
          iconDesc.name = "MeasureIcon";
        } else {
            iconDesc.name = "DimesionIcon";
        }
      } else if (treeViewItem.type === TreeItemTypesEnum.MeasureGroup) {
        if (this.expandedNodes.some((e) => e === treeViewItem.id)) {
          iconDesc.name = "MeasureFolderOpened";
          iconDesc.secondaryColor = "#154EC1";
        } else {
          iconDesc.name = "MeasureFolder";
          iconDesc.secondaryColor = "#154EC1";
        }
      } else if (treeViewItem.type === TreeItemTypesEnum.Hierarchy) {
        if (treeViewItem.originalItem.PARENT_CHILD) {
          iconDesc.name = "HierarchyParentChild";
          iconDesc.secondaryColor = "#154EC1";
        }
        iconDesc.name = "HierarchyNormal";
        iconDesc.secondaryColor = "#154EC1";
      } else if (treeViewItem.type === TreeItemTypesEnum.Level) {
        if (treeViewItem.originalItem.LEVEL_NUMBER === "0") {
          iconDesc.name = "LevelZero";
        }
        if (treeViewItem.originalItem.LEVEL_NUMBER === "1") {
          iconDesc.name = "LevelOne";
        }
        if (treeViewItem.originalItem.LEVEL_NUMBER === "2") {
          iconDesc.name = "LevelTwo";
        }
        if (treeViewItem.originalItem.LEVEL_NUMBER === "3") {
          iconDesc.name = "LevelThree";
        }
        if (treeViewItem.originalItem.LEVEL_NUMBER === "4") {
          iconDesc.name = "LevelFour";
        }
        if (treeViewItem.originalItem.LEVEL_NUMBER === "5") {
          iconDesc.name = "LevelFive";
        }
        if (treeViewItem.originalItem.LEVEL_NUMBER === "6") {
          iconDesc.name = "LevelSix";
        }
        if (treeViewItem.originalItem.LEVEL_NUMBER === "7") {
          iconDesc.name = "LevelSeven";
        }
        if (treeViewItem.originalItem.LEVEL_NUMBER === "8") {
          iconDesc.name = "LevelEight";
        }
        if (treeViewItem.originalItem.LEVEL_NUMBER === "9") {
          iconDesc.name = "LevelNine";
        }
      }
      return iconDesc;
    }
  }
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
              <div class="d-flex align-center">
                <XMLAIconVue :icon="getTreeViewItemIcon(node).name" :primary-color="getTreeViewItemIcon(node).primaryColor" :secondary-color="getTreeViewItemIcon(node).secondaryColor" :height="20" :width="20" class="mr-1"></XMLAIconVue>
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
              <div class="d-flex align-center">
                <XMLAIconVue :icon="getTreeViewItemIcon(node).name" :primary-color="getTreeViewItemIcon(node).primaryColor" :secondary-color="getTreeViewItemIcon(node).secondaryColor" :height="20" :width="20" class="mr-1"></XMLAIconVue>
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
            <XMLAIconVue :icon="getTreeViewItemIcon(node).name" :primary-color="getTreeViewItemIcon(node).primaryColor" :secondary-color="getTreeViewItemIcon(node).secondaryColor" :height="20" :width="20" class="mr-1"></XMLAIconVue>
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
