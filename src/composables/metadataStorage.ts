/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watch } from "vue";
import { optionalArrayToArray } from "@/utils/helpers";
import * as TreeViewItems from "@/stores/TreeViewItems";
import { property } from "lodash";
import type { XMLAApi } from "@/api/xml";

const MDDISPINFO_CHILD_COUNT = 65535;

let initPromiseResolve;
const initPromise = new Promise((res) => {
    initPromiseResolve = res;
});

interface MetadataStorage {
    hierarchies: MDSchemaHierarchy[];
    dimensions: MDSchemaDimension[];
    levels: MDSchemaLevel[];
    measureGroups: MDSchemaMeasureGroup[];
    measures: MDSchemaMeasure[];
    sets: MDSchemaSet[];
    properties: MDSchemaProperty[];
}

interface Cache {
    levelsState: Map<string, any>;
    membersState: Map<string, any>;
    levelMembers: Map<string, { loaded: boolean; hasMore: boolean }>;
    childMembers: Map<string, { loaded: boolean; hasMore: boolean }>;
    members: Map<string, any>;
}

const storage: MetadataStorage = {
    hierarchies: [],
    dimensions: [],
    levels: [],
    measureGroups: [],
    measures: [],
    sets: [],
    properties: [],
};

const cache: Cache = {
    levelsState: new Map(),
    membersState: new Map(),
    levelMembers: new Map(),
    childMembers: new Map(),
    members: new Map(),
};
let xmla_api: XMLAApi;

export function useMetadataStorage() {
    const expandedNodes = ref([]);

    const initMetadataStorage = async (api, catalogName, cubeName) => {
        xmla_api = api;

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

        storage.dimensions = dimensions;
        storage.hierarchies = hierarchies;
        storage.levels = levels;
        storage.measureGroups = measureGroups;
        storage.measures = measures;
        storage.sets = sets;
        storage.properties = properties;

        initPromiseResolve();
        return initPromise;
    };

    const getMetadataStorage = async () => {
        await initPromise;
        return storage;
    };

    const getTreeViewNodes = async () => {
        await initPromise;
        const tree = [getSets(storage), ...getDimensions(storage)];

        return reorderTree(tree);
    };

    const setExpandedNodes = async (nodes) => {
        const expandedRequests = [] as any[];

        cache.levelsState.forEach(async (e, key) => {
            if (nodes.some((nodeName) => nodeName === key)) {
                if (!e.inited) {
                    e.inited = true;
                    expandedRequests.push(async () => {
                        await loadLevelMembers(e.level, key);
                        e.opened = true;
                    });
                }
            }
        });

        cache.membersState.forEach(async (e, key) => {
            if (nodes.some((nodeName) => nodeName === key)) {
                if (!e.inited) {
                    e.inited = true;
                    expandedRequests.push(async () => {
                        await loadChildMembers(e.member, key);
                        e.opened = true;
                    });
                }
            }
        });

        await Promise.all(expandedRequests.map((e) => e()));
    };

    const loadMoreForNode = async (id) => {
        const level = cache.levelsState.get(id);
        if (level) {
            await loadLevelMembers(level.level, id);
        }

        const member = cache.membersState.get(id);
        if (member) {
            await loadChildMembers(member.member, id);
        }
    };

    return {
        initMetadataStorage,
        getTreeViewNodes,
        setExpandedNodes,
        loadMoreForNode,
        getMetadataStorage,
    };
}

function getSets(storage: MetadataStorage) {
    const setsFolder = TreeViewItems.getSetsFolderDesc();

    const sets = storage.sets.map((s: MDSchemaSet) => {
        return TreeViewItems.getSetDesc(s);
    });

    setsFolder.children = [...sets];
    return setsFolder;
}

function getDimensions(storage: MetadataStorage) {
    const dimensions = storage.dimensions;

    return dimensions.map((dimension) => {
        const dimensionDesc = TreeViewItems.getDimensionDesc(dimension);

        if (dimension.DIMENSION_UNIQUE_NAME === "[Measures]") {
            const measureGroups = getMeasureGroups(storage);
            dimensionDesc.children = [...measureGroups];
        } else {
            const sets = getSetsForDimensions(dimension, storage);
            const hierarchies = getChildHierarchies(dimension, storage);

            const childElements = reorderTree([...sets, ...hierarchies]);
            dimensionDesc.children = [...childElements];
        }

        return dimensionDesc;
    });
}

function getMeasureGroups(storage: MetadataStorage) {
    const measureGroups = storage.measureGroups.map((mg) => {
        const measureGroup = TreeViewItems.getMeasureGroupDesc(mg);

        const measures = storage.measures
            .filter((e) => e.MEASUREGROUP_NAME === mg.MEASUREGROUP_NAME)
            .map((e) => TreeViewItems.getMeasureDesc(e, mg));

        measureGroup.children = [...measures];

        return measureGroup;
    });

    const folders = getMeasureFolders(storage);

    return [...measureGroups, ...folders];
}

function getMeasureFolders(storage: MetadataStorage) {
    const folders = [] as TreeViewItems.FolderTreeItem[];

    storage.measures.forEach((m) => {
        if (
            m.MEASURE_DISPLAY_FOLDER &&
            typeof m.MEASURE_DISPLAY_FOLDER === "string"
        ) {
            const path = m.MEASURE_DISPLAY_FOLDER.split("\\");

            let depth = 0;
            let foldersCursor: TreeViewItems.TreeItem[] = folders;

            while (depth < path.length) {
                const currentPath = path[depth];

                const folder = foldersCursor.find(
                    (e) =>
                        e.type === TreeViewItems.TreeItemTypesEnum.Folder &&
                        (e as TreeViewItems.FolderTreeItem).name ===
                            currentPath,
                );

                if (folder) {
                    foldersCursor = folder.children as TreeViewItems.TreeItem[];
                } else {
                    const newFolder = TreeViewItems.getFolderDesc(
                        currentPath,
                        `Measures/${currentPath}`,
                    );

                    foldersCursor.push(newFolder);
                    foldersCursor = foldersCursor[foldersCursor.length - 1]
                        .children as TreeViewItems.TreeItem[];
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

function getSetsForDimensions(
    dimension: MDSchemaDimension,
    storage: MetadataStorage,
) {
    const setsFolder = TreeViewItems.getSetsFolderDesc(dimension);

    const dimensionSets = storage.sets
        .filter((s) => {
            const dimensions = s.DIMENSIONS.split(",");
            return dimensions.includes(dimension.DIMENSION_UNIQUE_NAME);
        })
        .map((set) => {
            return TreeViewItems.getSetDesc(set, dimension);
        });

    if (dimensionSets.length) {
        setsFolder.children = [...dimensionSets];
        return [setsFolder];
    }
    return [];
}

function getPriority(e: TreeViewItems.TreeItem) {
    if (
        e.type === TreeViewItems.TreeItemTypesEnum.Dimension &&
        (e as TreeViewItems.DimensionTreeItem).isMeasureDimension
    )
        return 3;
    if (e.type === TreeViewItems.TreeItemTypesEnum.SetsFolder) return 2;
    if (e.type === TreeViewItems.TreeItemTypesEnum.Dimension) return 1;
    return 0;
}

function reorderTree(tree: TreeViewItems.TreeItem[]) {
    return tree.sort((a: TreeViewItems.TreeItem, b: TreeViewItems.TreeItem) => {
        return getPriority(a) > getPriority(b) ? -1 : 1;
    });
}

function getChildHierarchies(
    dimension: MDSchemaDimension,
    storage: MetadataStorage,
) {
    const parsedHierarchies: TreeViewItems.HierarchyTreeItem[] = [];

    const childHierarchies = storage.hierarchies.filter(
        (h) => h.DIMENSION_UNIQUE_NAME === dimension.DIMENSION_UNIQUE_NAME,
    );

    childHierarchies.forEach((hierarchy) => {
        if (
            hierarchy.HIERARCHY_DISPLAY_FOLDER &&
            typeof hierarchy.HIERARCHY_DISPLAY_FOLDER === "string"
        ) {
            const path = hierarchy.HIERARCHY_DISPLAY_FOLDER.split("\\");

            let depth = 0;
            let foldersCursor: TreeViewItems.TreeItem[] = parsedHierarchies;
            while (depth < path.length) {
                const currentPath = path[depth];

                const folder = foldersCursor.find(
                    (e) =>
                        e.type === TreeViewItems.TreeItemTypesEnum.Folder &&
                        (e as TreeViewItems.FolderTreeItem).name ===
                            currentPath,
                );

                if (folder) {
                    foldersCursor = folder.children as TreeViewItems.TreeItem[];
                } else {
                    const newFolder = TreeViewItems.getFolderDesc(
                        currentPath,
                        `Dimension(${hierarchy.DIMENSION_UNIQUE_NAME}) /${currentPath}`,
                    );

                    foldersCursor.push(newFolder);
                    foldersCursor = foldersCursor[foldersCursor.length - 1]
                        .children as TreeViewItems.TreeItem[];
                }

                if (depth === path.length - 1) {
                    const parsedHierarchy =
                        TreeViewItems.getHierarchyDesc(hierarchy);
                    const childLevels = getChildLevels(hierarchy, storage);
                    parsedHierarchy.children = [...childLevels];

                    foldersCursor.push(parsedHierarchy);
                }

                depth++;
            }
        } else {
            const parsedHierarchy = TreeViewItems.getHierarchyDesc(hierarchy);
            const childLevels = getChildLevels(hierarchy, storage);

            parsedHierarchy.children = [...childLevels];

            parsedHierarchies.push(parsedHierarchy);
        }
    });

    return parsedHierarchies;
}

function getChildLevels(
    hierarchy: MDSchemaHierarchy,
    storage: MetadataStorage,
) {
    const levels = storage.levels
        .filter(
            (level) =>
                level.HIERARCHY_UNIQUE_NAME === hierarchy.HIERARCHY_UNIQUE_NAME,
        )
        .map((level) => {
            const parsedLevel = TreeViewItems.getLevelDesc(level);
            const levelProperties = getLevelProperties(level, storage);
            parsedLevel.children = [...levelProperties];

            let levelState = cache.levelsState.get(parsedLevel.id);

            if (!levelState) {
                cache.levelsState.set(parsedLevel.id, {
                    inited: false,
                    loaded: true,
                    opened: false,
                    level,
                });
                levelState = cache.levelsState.get(parsedLevel.id);
            }

            const { loaded: membersLoaded, members } = getMembers(
                level,
                storage,
                parsedLevel.id,
            );

            if (membersLoaded && levelState.opened) {
                parsedLevel.children.push(...members);
            } else {
                const loadingPlaceHolder = TreeViewItems.getLoadingItemDesc(
                    parsedLevel.id,
                );
                parsedLevel.children.push(loadingPlaceHolder);
            }

            return parsedLevel;
        });

    return levels;
}

function getLevelProperties(level: MDSchemaLevel, storage: MetadataStorage) {
    const levelProperties = storage.properties
        .filter(
            (property) =>
                property.LEVEL_UNIQUE_NAME === level.LEVEL_UNIQUE_NAME,
        )
        .map((property) => {
            const parsedProperty = TreeViewItems.getPropertyDesc(property);
            return parsedProperty;
        });

    if (levelProperties.length) {
        const levelPropertiesFolder = TreeViewItems.getFolderDesc(
            "Level Properties",
            `Dimension(${level.DIMENSION_UNIQUE_NAME})_Hierarcy(${level.HIERARCHY_UNIQUE_NAME})_Level(${level.LEVEL_UNIQUE_NAME})_LevelProperties`,
        );

        levelPropertiesFolder.children = [...levelProperties];

        return [levelPropertiesFolder];
    } else {
        return [];
    }
}

async function loadLevelMembers(level: MDSchemaLevel, id: string) {
    const count = 1000;
    let start = 0;

    const currentlyLoadedMembersState = cache.levelMembers.get(id);
    const currentlyLoadedMembers = cache.members.get(id);

    if (currentlyLoadedMembersState) {
        if (!currentlyLoadedMembersState.hasMore) return;
        start = currentlyLoadedMembers.members.length;
    }

    const members = await xmla_api.getLevelMembers(level, count, start);
    const parsedMembers = members.slice(0, -1).map((e): MDSchemaMember => {
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

    const treeViewMembers = parsedMembers.map((member) => {
        const desc = TreeViewItems.getMemberDesc(member);
        return desc;
    });

    const currentMembers = currentlyLoadedMembers?.members || [];

    cache.members.set(id, {
        members: [...currentMembers, ...treeViewMembers],
    });

    cache.levelMembers.set(id, {
        loaded: true,
        hasMore: members.length === count + 1,
    });
}

function getMembers(
    level: MDSchemaLevel,
    storage: MetadataStorage,
    levelTreeItemId: string,
) {
    const result = {
        loaded: false,
        members: [] as any[],
    };

    const parsedMembersDesc = cache.levelMembers.get(levelTreeItemId);
    const currentlyLoadedMembers = cache.members.get(levelTreeItemId);

    if (!parsedMembersDesc) return result;

    const extendedMembers = currentlyLoadedMembers.members.map((member) => {
        member.children = [];
        const children = getChildMembers(member.id);

        const childMembers = children.members;
        const childMembersLoaded = children.loaded;
        let membersState = cache.membersState.get(member.id);
        if (!membersState) {
            cache.membersState.set(member.id, {
                inited: false,
                loaded: false,
                opened: false,
                member: member.__MDSchemaMember,
            });
            membersState = cache.membersState.get(member.id);
        }

        if (member.hasChildren) {
            if (childMembersLoaded && membersState.opened) {
                member.children.push(...childMembers);
            } else {
                const loadingPlaceHolder = TreeViewItems.getLoadingItemDesc(
                    member.id,
                );
                member.children.push(loadingPlaceHolder);
            }
        }

        return member;
    });

    result.loaded = true;
    result.members = [...extendedMembers];
    if (parsedMembersDesc.hasMore) {
        const loadMoreButton =
            TreeViewItems.getLoadMoreItemDesc(levelTreeItemId);
        result.members.push(loadMoreButton);
    }
    return result;
}

function getChildMembers(memberTreeItemId: string) {
    const result = {
        loaded: false,
        members: [] as any[],
    };

    const parsedMembersDesc = cache.childMembers.get(memberTreeItemId);
    const currentlyLoadedMembers = cache.members.get(memberTreeItemId);

    if (!parsedMembersDesc) return result;

    const extendedMembers = currentlyLoadedMembers.members.map((member) => {
        member.children = [];
        const children = getChildMembers(member.id);

        const childMembers = children.members;
        const childMembersLoaded = children.loaded;
        let membersState = cache.membersState.get(member.id);
        if (!membersState) {
            cache.membersState.set(member.id, {
                inited: false,
                loaded: false,
                opened: false,
                member: member.__MDSchemaMember,
            });
            membersState = cache.membersState.get(member.id);
        }

        if (member.hasChildren) {
            if (childMembersLoaded && membersState.opened) {
                member.children.push(...childMembers);
            } else {
                const loadingPlaceHolder = TreeViewItems.getLoadingItemDesc(
                    member.id,
                );
                member.children.push(loadingPlaceHolder);
            }
        }

        return member;
    });

    result.loaded = true;
    result.members = [...extendedMembers];

    if (parsedMembersDesc.hasMore) {
        const loadMoreButton =
            TreeViewItems.getLoadMoreItemDesc(memberTreeItemId);
        result.members.push(loadMoreButton);
    }

    return result;
}

async function loadChildMembers(member: MDSchemaMember, id: string) {
    const count = 1000;
    let start = 0;

    const currentlyLoadedMembersState = cache.childMembers.get(id);
    const currentlyLoadedMembers = cache.members.get(id);

    if (currentlyLoadedMembersState) {
        if (!currentlyLoadedMembersState.hasMore) return;
        start = currentlyLoadedMembers.members.length;
    }

    const members = await xmla_api.getChildMembers(member, count, start);

    let parsedMembers;

    if (members.length > count) {
        parsedMembers = members.slice(0, -1);
    } else {
        parsedMembers = [...members];
    }
    parsedMembers = parsedMembers.map((e): MDSchemaMember => {
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

    cache.members.set(id, {
        members: [...currentMembers, ...treeViewMembers],
    });

    cache.childMembers.set(id, {
        loaded: true,
        hasMore: treeViewMembers.length === count + 1,
    });
}
