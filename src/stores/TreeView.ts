import type { XMLAApi } from "@/api/xml";
import { defineStore } from "pinia";
import { useAppSettingsStore } from "./AppSettings";
import type { DimensionTreeItem, TreeItem } from "./TreeViewItems";
import * as TreeViewItems from "./TreeViewItems";

// Done
function getLevelProperties(
  level: MDSchemaLevel,
  state: any
): TreeViewItems.FolderTreeItem[] {
  const levelProperties = state.properties
    .filter((property: MDSchemaProperty) => {
      return property.LEVEL_UNIQUE_NAME === level.LEVEL_UNIQUE_NAME;
    })
    .map((property: MDSchemaProperty) => {
      const parsedProperty = TreeViewItems.getPropertyDesc(property);
      return parsedProperty;
    });

  if (levelProperties.length) {
    const levelPropertiesFolder = TreeViewItems.getFolderDesc(
      "Level Properties",
      `Dimension(${level.DIMENSION_UNIQUE_NAME})_Hierarcy(${level.HIERARCHY_UNIQUE_NAME})_Level(${level.LEVEL_UNIQUE_NAME})_LevelProperties`
    );

    levelPropertiesFolder.children = [...levelProperties];

    return [levelPropertiesFolder];
  } else {
    return [];
  }
}

function getMembers() {}

function loadMoreMembers() {}

function getChildLevels(
  hierarchy: MDSchemaHierarchy,
  state: any
): TreeViewItems.LevelTreeItem[] {
  const levels = state.levels
    .filter((level: MDSchemaLevel) => {
      return level.HIERARCHY_UNIQUE_NAME === hierarchy.HIERARCHY_UNIQUE_NAME;
    })
    .map((level: MDSchemaLevel) => {
      const parsedLevel = TreeViewItems.getLevelDesc(level);
      const levelProperties = getLevelProperties(level, state);
      parsedLevel.children = [...levelProperties];
      const membersLoaded = state.members.has(parsedLevel.id);

      state.levelsState.set(parsedLevel.id, {
        inited: membersLoaded,
        hasMoreMembers: true,
        loading: true,
        onOpen: function () {
          if (!this.inited) {
            state.loadMembers(level, parsedLevel.id);
          }
        },
      });

      if (membersLoaded) {
        const parsedMembers = state.members.get(parsedLevel.id);
        parsedLevel.children.push(...parsedMembers);
      } else {
        const loadingPlaceHolder = TreeViewItems.getLoadingItemDesc(
          parsedLevel.id
        );
        parsedLevel.children.push(loadingPlaceHolder);
      }

      return parsedLevel;
    });

  return levels;
}

// Done
function getChildHierarchies(
  dimension: MDSchemaDimension,
  state: any
): (TreeViewItems.HierarchyTreeItem | TreeViewItems.FolderTreeItem)[] {
  const parsedHierarchies: (
    | TreeViewItems.HierarchyTreeItem
    | TreeViewItems.FolderTreeItem
  )[] = [];
  const childHierarchies: MDSchemaHierarchy[] = state.hierarchies.filter(
    (h: MDSchemaHierarchy) => {
      return h.DIMENSION_UNIQUE_NAME === dimension.DIMENSION_UNIQUE_NAME;
    }
  );

  childHierarchies.forEach((hierarchy: MDSchemaHierarchy) => {
    if (
      hierarchy.HIERARCHY_DISPLAY_FOLDER &&
      typeof hierarchy.HIERARCHY_DISPLAY_FOLDER === "string"
    ) {
      const path = hierarchy.HIERARCHY_DISPLAY_FOLDER.split("\\");

      let depth = 0;
      let foldersCursor: TreeItem[] = parsedHierarchies;
      while (depth < path.length) {
        const curPath = path[depth];
        const folder: TreeViewItems.FolderTreeItem | undefined =
          foldersCursor.find(
            (e) =>
              e.type === TreeViewItems.TreeItemTypesEnum.Folder &&
              (e as TreeViewItems.FolderTreeItem).name === curPath
          ) as TreeViewItems.FolderTreeItem | undefined;
        if (folder) {
          foldersCursor = folder.children;
        } else {
          const newFolder = TreeViewItems.getFolderDesc(
            curPath,
            `Dimension(${hierarchy.DIMENSION_UNIQUE_NAME}) /${curPath}`
          );
          foldersCursor.push(newFolder);
          foldersCursor = (
            foldersCursor[
              foldersCursor.length - 1
            ] as TreeViewItems.FolderTreeItem
          ).children;
        }

        if (depth === path.length - 1) {
          const parsedHierarchy = TreeViewItems.getHierarchyDesc(hierarchy);
          const childLevels = getChildLevels(hierarchy, state);
          parsedHierarchy.children = [...childLevels];

          foldersCursor.push(parsedHierarchy);
        }

        depth++;
      }
    } else {
      const parsedHierarchy = TreeViewItems.getHierarchyDesc(hierarchy);
      const childLevels = getChildLevels(hierarchy, state);
      parsedHierarchy.children = [...childLevels];

      parsedHierarchies.push(parsedHierarchy);
    }
  });

  return parsedHierarchies;
}

// Done
function getMeasureFolders(state: any): any[] {
  const folders: TreeViewItems.FolderTreeItem[] = [];
  state.measures.forEach((m: MDSchemaMeasure) => {
    if (
      m.MEASURE_DISPLAY_FOLDER &&
      typeof m.MEASURE_DISPLAY_FOLDER === "string"
    ) {
      const path = m.MEASURE_DISPLAY_FOLDER.split("\\");

      let depth = 0;
      let foldersCursor: TreeItem[] = folders;
      while (depth < path.length) {
        const curPath = path[depth];
        const folder: TreeViewItems.FolderTreeItem | undefined =
          foldersCursor.find(
            (e) =>
              e.type === TreeViewItems.TreeItemTypesEnum.Folder &&
              (e as TreeViewItems.FolderTreeItem).name === curPath
          ) as TreeViewItems.FolderTreeItem | undefined;
        if (folder) {
          foldersCursor = folder.children;
        } else {
          const newFolder = TreeViewItems.getFolderDesc(
            curPath,
            `Measures/${curPath}`
          );
          foldersCursor.push(newFolder);
          foldersCursor = (
            foldersCursor[
              foldersCursor.length - 1
            ] as TreeViewItems.FolderTreeItem
          ).children;
        }

        if (depth === path.length - 1) {
          const measure = TreeViewItems.getMeasureDesc(m);
          foldersCursor.push(measure);
        }

        depth++;
      }
    }
  });
  return folders;
}

// Done
function getMeasureGroups(state: any): any[] {
  const measureGroups = state.measureGroups.map((mg: MDSchemaMeasureGroup) => {
    const measureGroup = TreeViewItems.getMeasureGroupDesc(mg);

    const measures = state.measures
      .filter((e: MDSchemaMeasure) => {
        return e.MEASUREGROUP_NAME === mg.MEASUREGROUP_NAME;
      })
      .map((e: MDSchemaMeasure) => TreeViewItems.getMeasureDesc(e, mg));

    measureGroup.children = [...measures];

    return measureGroup;
  });

  const folders = getMeasureFolders(state);

  return [...measureGroups, ...folders];
}

// Done
function getSets(state: any): any {
  const setsFolder = TreeViewItems.getSetsFolderDesc();

  const sets = state.sets.map((s: MDSchemaSet) => {
    return TreeViewItems.getSetDesc(s);
  });

  setsFolder.children = [...sets];
  return setsFolder;
}

// Done
function getSetsForDimensions(
  dimension: MDSchemaDimension,
  state: any
): [TreeViewItems.SetsFolderTreeItem?] {
  const setsFolder = TreeViewItems.getSetsFolderDesc(dimension);

  const dimensionSets: TreeViewItems.SetTreeItem[] = state.sets
    .filter((s: MDSchemaSet) => {
      const dimensions = s.DIMENSIONS.split(",") as string[];
      return dimensions.includes(dimension.DIMENSION_UNIQUE_NAME);
    })
    .map((set: MDSchemaSet) => {
      return TreeViewItems.getSetDesc(set, dimension);
    });

  if (dimensionSets.length) {
    setsFolder.children = [...dimensionSets];
    return [setsFolder];
  }
  return [];
}

// Done
function getPriority(e: TreeItem) {
  if (
    e.type === TreeViewItems.TreeItemTypesEnum.Dimension &&
    (e as DimensionTreeItem).isMeasureDimension
  )
    return 3;
  if (e.type === TreeViewItems.TreeItemTypesEnum.SetsFolder) return 2;
  if (e.type === TreeViewItems.TreeItemTypesEnum.Dimension) return 1;
  return 0;
}

// Done
function reorderTree(tree: TreeItem[]) {
  return tree.sort((a: TreeItem, b: TreeItem) => {
    return getPriority(a) > getPriority(b) ? -1 : 1;
  });
}

// Done
function getDimensions(state: any): DimensionTreeItem[] {
  const dimensions = state.dimensions as MDSchemaDimension[];

  return dimensions.map((dimension: MDSchemaDimension) => {
    const dimensionDesc = TreeViewItems.getDimensionDesc(dimension);

    if (dimension.DIMENSION_UNIQUE_NAME === "[Measures]") {
      const measureGroups = getMeasureGroups(state);
      dimensionDesc.children = [...measureGroups];
    } else {
      const sets = getSetsForDimensions(dimension, state) as TreeItem[];
      const hierarchies = getChildHierarchies(dimension, state);

      const childElements = reorderTree([...sets, ...hierarchies]);
      dimensionDesc.children = [...childElements];
    }

    return dimensionDesc;
  });
}

export const useTreeViewDataStore = defineStore("TreeViewData", {
  state: () => {
    return {
      metadataLoaded: false,
      hierarchies: [] as MDSchemaHierarchy[],
      dimensions: [] as MDSchemaDimension[],
      levels: [] as MDSchemaLevel[],
      measureGroups: [] as MDSchemaMeasureGroup[],
      measures: [] as MDSchemaMeasure[],
      sets: [] as MDSchemaSet[],
      properties: [] as MDSchemaProperty[],
      levelsState: new Map<string, any>(),
      api: null as unknown as XMLAApi,
      members: new Map<string, any[]>(),
    };
  },
  actions: {
    async fetchCubeData(catalogName: string, cubeName: string) {
      const appSettings = useAppSettingsStore();
      const api = appSettings.getApi();

      const [
        dimensions,
        hierarchies,
        levels,
        measureGroups,
        measures,
        sets,
        properties,
      ] = await Promise.all([
        await api.getDimensions(catalogName, cubeName),
        await api.getHierarchies(catalogName, cubeName),
        await api.getLevels(catalogName, cubeName),
        await api.getMeasureGroups(catalogName, cubeName),
        await api.getMeasures(catalogName, cubeName),
        await api.getSets(catalogName, cubeName),
        await api.getProperties(catalogName, cubeName),
      ]);

      this.metadataLoaded = true;
      this.hierarchies = hierarchies;
      this.dimensions = dimensions;
      this.levels = levels;
      this.measureGroups = measureGroups;
      this.measures = measures;
      this.sets = sets;
      this.properties = properties;
      this.api = api;
    },
    callExpandedMethods(expandedNodes: string[]) {
      expandedNodes.forEach(async (nodeId) => {
        if (this.levelsState.has(nodeId)) {
          const levelState = this.levelsState.get(nodeId);
          await levelState.onOpen();
        }
      });
    },
    async loadMembers(level: MDSchemaLevel, id: string) {
      const childMembers = await this.api.getMembers(level);
      const parsedMembers = childMembers.map((member: MDSchemaMember) => {
        return TreeViewItems.getMemberDesc(member);
      });

      this.members.set(id, parsedMembers);
    },
  },
  getters: {
    treeViewNodes: (state) => {
      if (!state.metadataLoaded) return [];
      const tree = [getSets(state), ...getDimensions(state)];

      return reorderTree(tree);
    },
  },
});
