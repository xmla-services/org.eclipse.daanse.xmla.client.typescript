import { ref, watch } from "vue";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { debounce } from "lodash";

const MDDISPINFO_CHILD_COUNT = 65535;

function optionalArrayToArray(el: any): any[] {
  if (Array.isArray(el)) return el;
  if (el) {
    return [el];
  }
  return [];
}

function fillTree(treeNode: any, childMembers: any[]) {
  const children = childMembers.filter(
    (member) => member.PARENT_UNIQUE_NAME === treeNode.UName
  );

  treeNode.id = treeNode.UName;

  if (children.length) {
    treeNode.children = [...children];
    treeNode.children.forEach((childNode: any) => {
      fillTree(childNode, childMembers);
    });

    treeNode.loaded = true;
  } else {
    treeNode.loaded = false;

    const childCount = treeNode.DisplayInfo & MDDISPINFO_CHILD_COUNT;
    if (childCount) {
      treeNode.children = [
        {
          isLoading: true,
          id: `Loading_${treeNode.UName}`,
        },
      ];
    }
  }
}

function getTreeItem(e: any) {
  const treeItem = {
    ...e.Member,
    id: e.Member.UName,
    loaded: false,
  };

  const childCount = treeItem.DisplayInfo & MDDISPINFO_CHILD_COUNT;

  if (childCount) {
    treeItem.children = [
      {
        isLoading: true,
        id: `Loading_${e.Member.UName}`,
      },
    ];
  }

  return treeItem;
}

export async function useSearchResultTreeData(element: {
  item: MDSchemaHierarchy;
  filters: any;
}) {
  const appSettings = useAppSettingsStore();
  const api = appSettings.getApi();

  const filteredTree = ref([] as any[]);
  const levels = ref([] as MDSchemaLevel[]);
  const searchValue = ref("");

  try {
    const hierarchyLevelsResponce = await api.getHierarchyLevels(
      element.item.CATALOG_NAME,
      element.item.CUBE_NAME,
      element.item.HIERARCHY_UNIQUE_NAME
    );

    levels.value = [
      {
        LEVEL_UNIQUE_NAME: "All Members",
        LEVEL_CAPTION: "All Members",
      } as MDSchemaLevel,
      ...hierarchyLevelsResponce,
    ];
    console.log(levels);
  } catch (e) {
    console.log(e);
  }
  const searchBy = ref(levels.value[0].LEVEL_UNIQUE_NAME);

  watch(
    searchValue,
    debounce(async () => {
      try {
        console.log(searchBy.value);
        let mdx = `
          WITH Set FilteredMembers As 'Head (Filter(AddCalculatedMembers(${element.item.HIERARCHY_UNIQUE_NAME}.Members), InStr(1, ${element.item.HIERARCHY_UNIQUE_NAME}.currentmember.member_caption, "${searchValue.value}")>0),10001)'
          Select
          Hierarchize(Generate(FilteredMembers, Ascendants(${element.item.HIERARCHY_UNIQUE_NAME}.currentmember))) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, MEMBER_TYPE ON 0, {} ON 1 FROM ${element.item.CUBE_NAME}
        `;
        if (searchBy.value !== "All Members") {
          mdx = `
            WITH Set FilteredMembers As 'Head (Filter(AddCalculatedMembers(${searchBy.value}.Members), InStr(1, ${element.item.HIERARCHY_UNIQUE_NAME}.currentmember.member_caption, "${searchValue.value}")>0),10001)'
            Select
            Hierarchize(Generate(FilteredMembers, Ascendants(${element.item.HIERARCHY_UNIQUE_NAME}.currentmember))) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, MEMBER_TYPE ON 0, {} ON 1 FROM ${element.item.CUBE_NAME}
          `;
        }
        const childMembersResponce = await api.getMDX(mdx);
        const childMembers = optionalArrayToArray(
          childMembersResponce.Body.ExecuteResponse.return.root.Axes.Axis[0]
            .Tuples.Tuple
        ).map(({ Member }) => Member);

        const tree = childMembers.filter(
          (member) => !member.PARENT_UNIQUE_NAME
        );

        tree.forEach((treeNode) => {
          fillTree(treeNode, childMembers);
        });

        filteredTree.value = tree;
      } catch (e) {
        console.log(e);
      }
    }, 500)
  );

  async function loadChildrenRecursive(treeNode: any, expandedIds: string[]) {
    if (expandedIds.includes(treeNode.id)) {
      if (!treeNode.loaded) {
        treeNode.loaded = true;

        try {
          const mdx = `
            SELECT {AddCalculatedMembers({${treeNode.UName}.Children})} DIMENSION PROPERTIES MEMBER_TYPE ON 0, {} ON 1 FROM ${element.item.CUBE_NAME} CELL PROPERTIES CELL_ORDINAL
          `;
          const childrenResponce = await api.getMDX(mdx);
          const children = optionalArrayToArray(
            childrenResponce.Body.ExecuteResponse.return.root.Axes.Axis[0]
              .Tuples.Tuple
          ).map(getTreeItem);

          treeNode.children = [...children];
        } catch (e) {
          console.log(e);
        }
      }

      treeNode.children.forEach((childNode: any) => {
        loadChildrenRecursive(childNode, expandedIds);
      });
    }
  }

  const triggerExpandedWithSearch = async (expandedIds: string[]) => {
    const currentTreeState = filteredTree.value;
    currentTreeState.forEach((treeNode: any) => {
      loadChildrenRecursive(treeNode, expandedIds);
    });
  };

  return {
    filteredTree,
    levels,
    searchBy,
    searchValue,
    triggerExpandedWithSearch,
  };
}
