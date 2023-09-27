<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Markus Hochstein

-->
<script setup lang="ts">
import { optionalArrayToArray } from "@/utils/helpers";
import { watch, ref, onMounted, computed } from "vue";
//@ts-ignore
import { storeToRefs } from "pinia";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { use3dChartStore } from "@/stores/3dChart";
import PointCluster from "./PointCluster/PointCluster.vue";
import { debounce, chunk } from "lodash";
import PointClusterSettingsModal from "./PointCluster/PointClusterSettingsModal.vue";

// const queryDesignerStore = useQueryDesignerStore();
const chartStore = use3dChartStore();
const { mdx } = storeToRefs(chartStore);
const appSettings = useAppSettingsStore();
const api = appSettings.getApi();

const rows = ref([] as any[]);
const columns = ref([] as any[]);
const cells = ref([] as any[]);
const labels = ref([] as any[]);
const datasets = ref([] as any[]);
let notExpandableIndexes = [] as number[];
let expandedIndexes = [] as number[];
let shouldBeHidden = [] as string[];

const getData = debounce(async () => {
  shouldBeHidden = [];
  expandedIndexes = [];
  notExpandableIndexes = [];
  const loadingId = appSettings.setLoadingState();

  const mdx = chartStore.mdx;
  const mdxResponce = await api.getMDX(mdx);

  const axis0 = optionalArrayToArray(
    mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[0]?.Tuples?.Tuple,
  );
  const axis1 = optionalArrayToArray(
    mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[1]?.Tuples?.Tuple,
  );
  const cellsArray = chunk(
    optionalArrayToArray(
      mdxResponce.Body.ExecuteResponse.return.root.CellData?.Cell,
    ),
    3,
  );

  columns.value = chunk(axis0, 3).map((e) => {
    console.log(axis0);
    const parsedCols = optionalArrayToArray(e[0].Member);
    return parsedCols;
  });

  console.log("columns", columns.value);

  columns.value.forEach((column) => {
    const firstHierarchy = column[0];

    const childMembers = columns.value.filter(
      (member) => firstHierarchy.UName === member[0].PARENT_UNIQUE_NAME,
    );

    if (childMembers.length) {
      const index = columns.value.findIndex(
        (e) => e[0].UName === firstHierarchy.UName,
      );

      const expanded = chartStore.$state.state.columnsExpandedMembers;
      if (expanded.some((e) => e.UName === firstHierarchy.UName)) {
        expandedIndexes.push(index);
      } else {
        notExpandableIndexes.push(index);
      }
    }
  });

  rows.value = axis1.map((e: { Member: any }) => {
    return optionalArrayToArray(e.Member);
  });
  cells.value = parseCells(cellsArray, columns.value, rows.value);

  const labelsCaptions = rows.value.map((row) =>
    row.map((e) => e.Caption).join(" / "),
  );

  console.log("cellsValue", cells.value);

  datasets.value = rows.value.map((col, ind) => {
    const data = columns.value.map((e, i) => {
      console.log(ind, i);
      const xValue =
        cells.value[ind][i][0].FmtValue || cells.value[ind][i][0].Value || "";
      const yValue =
        cells.value[ind][i][1].FmtValue || cells.value[ind][i][1].Value || "";
      const zValue =
        cells.value[ind][i][2].FmtValue || cells.value[ind][i][2].Value || "";

      console.log(xValue);

      return {
        x: xValue === "object" ? 0 : parseFloat(xValue.replaceAll(",", "")),
        y: yValue === "object" ? 0 : parseFloat(yValue.replaceAll(",", "")),
        z: zValue === "object" ? 0 : parseFloat(zValue.replaceAll(",", "")),
      };
    });

    return {
      label: labelsCaptions[ind],
      data: data,
    };
  });

  const getItemWithChilds = (item) => {
    const result: any = {
      label: item.map((f) => f.Caption).join("/"),
      member: item[0],
    };
    const childItems = columns.value.filter(
      (c) => c[0].PARENT_UNIQUE_NAME === item[0].UName,
    );

    result.expand = true;
    result.children = childItems.map((child) => {
      shouldBeHidden.push(child[0].UName);

      const indexInColumns = columns.value.findIndex((e) => {
        return e[0].UName === child[0].UName;
      });

      if (expandedIndexes.some((i) => i === indexInColumns)) {
        return getItemWithChilds(child);
      } else {
        return {
          label: child.map((f) => f.Caption).join("/"),
          member: child[0],
          children: [
            {
              label: "Loading",
              loader: true,
              member: child[0],
            },
          ],
        };
      }
    });
    return result;
  };

  labels.value = columns.value
    .map((e, idx) => {
      const result: any = {
        label: e.map((f) => f.Caption).join("/"),
        member: e[0],
      };

      if (expandedIndexes.some((i) => i === idx)) {
        return getItemWithChilds(e);
      } else if (!notExpandableIndexes.some((i) => i === idx)) {
        result.children = [
          {
            label: "Loading",
            loader: true,
            member: e[0],
          },
        ];
      }

      return result;
    })
    .filter((e) => {
      if (shouldBeHidden.some((hidden) => hidden === e.member.UName)) {
        return false;
      }
      return true;
    });

  appSettings.removeLoadingState(loadingId);
}, 100);

function parseCells(cells: any[], columns: any[], rows: any[]) {
  if (!cells.length) return [];
  if (!rows.length || !columns.length) {
    if (rows.length === columns.length) {
      return [cells];
    }
    return [];
  }
  const cp = [...cells] as any[];

  const columnsArray = [] as any[];
  const count = columns.length;
  while (cp.length) {
    columnsArray.push(cp.splice(0, count));
  }
  return columnsArray;
}

watch(mdx, async () => {
  await getData();
});

onMounted(async () => {
  await getData();
});

const pointClusterSettingsModal = ref(null);

const openSettings = async () => {
  const res = await pointClusterSettingsModal.value.run();
  console.log(chartStore);
  chartStore.setMeasures(res);
  console.log(res);
};
</script>

<template>
  <div>
    <div>
      <va-button
        icon="settings"
        color="secondary"
        preset="secondary"
        @click="openSettings"
      />
      <Teleport to="body">
        <PointClusterSettingsModal ref="pointClusterSettingsModal" />
      </Teleport>
    </div>
    <div class="chart_container" ref="chart_holder">
      <point-cluster :labels="labels" :data="datasets" :width="1200" />
    </div>
  </div>
</template>

<style lang="scss">
.chart_container {
  padding: 30px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#chart {
  width: 100%;
  height: 100%;
}
</style>
