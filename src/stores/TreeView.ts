import type { XMLAApi } from "@/api/xml";
import { defineStore } from "pinia";
import { useAppSettingsStore } from "./AppSettings";
import type { DimensionTreeItem, TreeItem } from "./TreeViewItems";
import * as TreeViewItems from "./TreeViewItems";

const MDDISPINFO_CHILD_COUNT = 65535;
const membersStorage = new Map();

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

function getMembers(level: MDSchemaLevel, state: any, levelTreeItemId: string) {
  const result = {
    loaded: false,
    members: [] as any[],
  };

  const parsedMembersDesc = state.members.get(levelTreeItemId);
  const currentlyLoadedMembers = membersStorage.get(levelTreeItemId);

  if (!parsedMembersDesc) return result;

  const extendedMembers = currentlyLoadedMembers.members.map(
    (e: TreeViewItems.MemberTreeItem) => {
      e.children = [];
      const childs = getChildMembers(state, e.id);

      const childMembers = childs.members;
      const childMembersLoaded = childs.loaded;
      let memberState = state.membersState.get(e.id);
      if (!memberState) {
        state.membersState.set(e.id, {
          inited: false,
          loaded: false,
          opened: false,
          onOpen: function () {
            if (!this.inited) {
              this.inited = true;
              state.getChildMembers(e.__MDSchemaMember, e.id);
            }
          },
        });
        memberState = state.membersState.get(e.id);
      }

      if (e.hasChildren) {
        if (childMembersLoaded && memberState.opened) {
          e.children.push(...childMembers);
        } else {
          const loadingPlaceHolder = TreeViewItems.getLoadingItemDesc(e.id);
          e.children.push(loadingPlaceHolder);
        }
      }

      return e;
    }
  );

  result.loaded = true;
  result.members = [...extendedMembers];
  if (parsedMembersDesc.hasMore) {
    const loadMoreButton = TreeViewItems.getLoadMoreItemDesc(
      levelTreeItemId,
      () => {
        state.getLevelMembers(level, levelTreeItemId);
      }
    );
    result.members.push(loadMoreButton);
  }
  return result;
}

function getChildMembers(state: any, memberTreeItemId: string) {
  const result = {
    loaded: false,
    members: [] as any[],
  };

  const parsedMembersDesc = state.members.get(memberTreeItemId);
  const currentlyLoadedMembers = membersStorage.get(memberTreeItemId);

  if (!parsedMembersDesc) return result;

  const extendedMembers = currentlyLoadedMembers.members.map(
    (e: TreeViewItems.MemberTreeItem) => {
      e.children = [];
      const childs = getChildMembers(state, e.id);

      const childMembers = childs.members;
      const childMembersLoaded = childs.loaded;
      let memberState = state.membersState.get(e.id);
      if (!memberState) {
        state.membersState.set(e.id, {
          inited: false,
          loaded: false,
          opened: false,
          onOpen: function () {
            if (!this.inited) {
              this.inited = true;
              state.getChildMembers(e.__MDSchemaMember, e.id);
            }
          },
        });
        memberState = state.membersState.get(e.id);
      }

      if (e.hasChildren) {
        if (childMembersLoaded && memberState.opened) {
          e.children.push(...childMembers);
        } else {
          const loadingPlaceHolder = TreeViewItems.getLoadingItemDesc(e.id);
          e.children.push(loadingPlaceHolder);
        }
      }

      return e;
    }
  );

  result.loaded = true;
  result.members = [...extendedMembers];

  if (parsedMembersDesc.hasMore) {
    const loadMoreButton = TreeViewItems.getLoadMoreItemDesc(
      memberTreeItemId,
      () => {
        state.getChildMembers(memberTreeItemId);
      }
    );
    result.members.push(loadMoreButton);
  }
  return result;
}

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

      let levelState = state.levelsState.get(parsedLevel.id);
      if (!levelState) {
        state.levelsState.set(parsedLevel.id, {
          inited: false,
          loaded: true,
          opened: false,
          onOpen: function () {
            if (!this.inited) {
              this.inited = true;
              state.getLevelMembers(level, parsedLevel.id);
            }
          },
        });
        levelState = state.levelsState.get(parsedLevel.id);
      }

      const { loaded: membersLoaded, members } = getMembers(
        level,
        state,
        parsedLevel.id
      );

      if (membersLoaded && levelState.opened) {
        parsedLevel.children.push(...members);
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
      membersState: new Map<string, any>(),
      api: null as unknown as XMLAApi,
      members: new Map<string, { loaded: boolean; hasMore: boolean }>(),
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
      this.levelsState.forEach((e, key) => {
        if (expandedNodes.find((nodeName) => nodeName === key)) {
          e.onOpen();
          e.opened = true;
        } else {
          e.opened = false;
        }
      });
      this.membersState.forEach((e, key) => {
        if (expandedNodes.find((nodeName) => nodeName === key)) {
          e.onOpen();
          e.opened = true;
        } else {
          e.opened = false;
        }
      });
      // expandedNodes.forEach(async (nodeId) => {

      //   if (this.levelsState.has(nodeId)) {
      //     const levelState = this.levelsState.get(nodeId);
      //     await levelState.onOpen();
      //   }
      // });
    },
    // async loadMembers(level: MDSchemaLevel, id: string) {
    //   const childMembers = await this.api.getMembers(level);
    //   const treeViewMembers = childMembers.map((member: MDSchemaMember) => {
    //     return TreeViewItems.getMemberDesc(member);
    //   });

    //   // this.members.set(id, treeViewMembers);
    // },
    async getLevelMembers(level: MDSchemaLevel, id: string) {
      const count = 1000;
      let start = 0;

      const currentlyLoadedMembersState = this.members.get(id);
      const currentlyLoadedMembers = membersStorage.get(id);

      if (currentlyLoadedMembersState) {
        if (!currentlyLoadedMembersState.hasMore) return;
        start = currentlyLoadedMembers.members.length;
      }

      const members = await this.api.getLevelMembers(level, count, start);
      const parsedMembers = members.map((e): MDSchemaMember => {
        const displayInfo = e.Member.DisplayInfo;
        const childCount = displayInfo & MDDISPINFO_CHILD_COUNT;

        return {
          CATALOG_NAME: level.CATALOG_NAME,
          CUBE_NAME: level.CUBE_NAME,
          DIMENSION_UNIQUE_NAME: level.DIMENSION_UNIQUE_NAME,
          HIERARCHY_UNIQUE_NAME: level.HIERARCHY_UNIQUE_NAME,
          LEVEL_UNIQUE_NAME: level.LEVEL_UNIQUE_NAME,
          LEVEL_NAME: level.LEVEL_NAME,
          LEVEL_NUMBER: level.LEVEL_NUMBER,
          LEVEL_CAPTION: level.LEVEL_CAPTION,
          MEMBER_CAPTION: e.Member.Caption,
          MEMBER_NAME: e.Member.UName,
          MEMBER_UNIQUE_NAME: e.Member.UName,
          HAS_CHILDREN: childCount > 0,
          PARENT_UNIQUE_NAME: level.PARENT_UNIQUE_NAME,
        };
      });
      const treeViewMembers = parsedMembers.map((member: MDSchemaMember) => {
        const desc = TreeViewItems.getMemberDesc(member);
        return desc;
      });
      const currentMembers = currentlyLoadedMembers?.members || [];

      membersStorage.set(id, {
        members: [...currentMembers, ...treeViewMembers],
      });

      this.members.set(id, {
        loaded: true,
        hasMore: treeViewMembers.length === count + 1,
      });
    },
    async getChildMembers(member: MDSchemaMember, id: string) {
      const count = 1000;
      let start = 0;

      const currentlyLoadedMembersState = this.members.get(id);
      const currentlyLoadedMembers = membersStorage.get(id);

      if (currentlyLoadedMembersState) {
        if (!currentlyLoadedMembersState.hasMore) return;
        start = currentlyLoadedMembers.members.length;
      }

      const members = await this.api.getChildMembers(member, count, start);

      const parsedMembers = members.map((e): MDSchemaMember => {
        const displayInfo = e.Member.DisplayInfo;
        const childCount = displayInfo & MDDISPINFO_CHILD_COUNT;

        return {
          CATALOG_NAME: member.CATALOG_NAME,
          CUBE_NAME: member.CUBE_NAME,
          DIMENSION_UNIQUE_NAME: member.DIMENSION_UNIQUE_NAME,
          HIERARCHY_UNIQUE_NAME: member.HIERARCHY_UNIQUE_NAME,
          LEVEL_UNIQUE_NAME: member.LEVEL_UNIQUE_NAME,
          LEVEL_NAME: member.LEVEL_NAME,
          LEVEL_NUMBER: member.LEVEL_NUMBER,
          LEVEL_CAPTION: member.LEVEL_CAPTION,
          MEMBER_CAPTION: e.Member.Caption,
          MEMBER_NAME: e.Member.UName,
          MEMBER_UNIQUE_NAME: e.Member.UName,
          HAS_CHILDREN: childCount > 0,
          PARENT_UNIQUE_NAME: member.PARENT_UNIQUE_NAME,
        };
      });
      const treeViewMembers = parsedMembers.map((member: MDSchemaMember) => {
        const desc = TreeViewItems.getMemberDesc(member);
        return desc;
      });
      const currentMembers = currentlyLoadedMembers?.members || [];

      membersStorage.set(id, {
        members: [...currentMembers, ...treeViewMembers],
      });

      this.members.set(id, {
        loaded: true,
        hasMore: treeViewMembers.length === count + 1,
      });
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
