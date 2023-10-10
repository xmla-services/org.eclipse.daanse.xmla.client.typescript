<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Markus Hochstein

-->
<script lang="ts">
import { useQueryDesignerStore } from "@/stores/QueryDesigner";
import { optionalArrayToArray } from "@/utils/helpers";
import {defineComponent, watch, ref, onMounted, type Ref, toRef} from "vue";
import { Bar } from "vue-chartjs";
//@ts-ignore
import autocolors from "chartjs-plugin-autocolors";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Colors,
} from "chart.js";
import { storeToRefs } from "pinia";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { HierarchicalScale } from "chartjs-plugin-hierarchical";
import { useChartStore } from "@/stores/Chart";
import { debounce } from "lodash";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  autocolors,
  HierarchicalScale
);

export default defineComponent({
  props: {
    chartStore: {
      type:String,
      default:null
    },
    mdx:{
      type:String,
      default:''
    },
    //tableStore: String
  },
  setup(props) {
    let chartStore = null;

    let chartStoreUse = toRef(props, 'chartStore')
    let _mdx = toRef(props, 'mdx')
    //let tableStoreUse = toRef(props, 'tableStore')
    // const queryDesignerStore = useQueryDesignerStore();
    if(chartStoreUse.value){
       chartStore = useChartStore(chartStoreUse.value,_mdx.value)();
    }else{
       chartStore = useChartStore('Chart')();
    }




    const { mdx } = storeToRefs(chartStore);
    const appSettings = useAppSettingsStore();
    const api = appSettings.getApi();

    const rows = ref([] as any[]);
    const columns = ref([] as any[]);
    const cells = ref([] as any[]);
    const labels = ref([] as any[]);
    const datasets = ref([] as any[]);
    const chartTimestamp = ref(Date.now());
    let notExpandableIndexes = [] as number[];
    let expandedIndexes = [] as number[];
    let shouldBeHidden = [] as string[];

    const plugins = [autocolors];

    const updateChartData = () => {
      setTimeout(() => {
        const { chart } = chartRef.value;

        chart.data.datasets.forEach((dataset) => {
          dataset.data = [];
        });

        chart.data.datasets.forEach((dataset, i) => {
          datasets.value[i].data.forEach((data, j) => {
            if (!expandedIndexes.some((ind) => ind === j)) {
              dataset.data.push(data);
            }
          });
        });

        chart.update();
      }, 100);
    };

    const getData = debounce(async () => {
      shouldBeHidden = [];
      expandedIndexes = [];
      notExpandableIndexes = [];
      const loadingId = appSettings.setLoadingState();

      const mdx = chartStore.mdx;
      const mdxResponce = await api.getMDX(mdx);

      const axis0 = optionalArrayToArray(
        mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[0]?.Tuples
          ?.Tuple
      );
      const axis1 = optionalArrayToArray(
        mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[1]?.Tuples
          ?.Tuple
      );
      const cellsArray = optionalArrayToArray(
        mdxResponce.Body.ExecuteResponse.return.root.CellData?.Cell
      );

      columns.value = axis0.map((e: { Member: any }) => {
        const parsedCols = optionalArrayToArray(e.Member);
        return parsedCols;
      });

      columns.value.forEach((column) => {
        const firstHierarchy = column[0];

        const childMembers = columns.value.filter(
          (member) => firstHierarchy.UName === member[0].PARENT_UNIQUE_NAME
        );

        if (childMembers.length) {
          const index = columns.value.findIndex(
            (e) => e[0].UName === firstHierarchy.UName
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

      const labelsCaptions = rows.value.map((row) => {
            console.log(row);
            return row.map((e) => e.Caption).join(" / ")
          }
      );

      datasets.value = rows.value.map((col, ind) => {
        const data = columns.value.map((e, i) => {
          const formatedValue =
            cells.value[ind][i].FmtValue || cells.value[ind][i].Value || "";
          if (formatedValue === "object") return 0;
          return parseFloat(formatedValue.replaceAll(",", ""));
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
          (c) => c[0].PARENT_UNIQUE_NAME === item[0].UName
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

      updateChartData();
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

    const chartRef = ref(null) as Ref<any>;



    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: "bottom",
          labels: {
            usePointStyle: true,
            font: {
              size: 9,
            },
          },
        },
      },
      scales: {
        x: {
          ticks:{
            // Include a dollar sign in the ticks
            callback: function(value, index, ticks) {
              //console.log(labels.value[index].label)
              let lbl = labels.value[index].label
              if (typeof lbl === 'string' && lbl.length > 10) {
                lbl = lbl.substring(0, 10); // cutting
                lbl+= '...'
              }
              return lbl;
            }
          }
        }
      },
      layout: {
        padding: {
          left: 25,
          right: 25,
          top: 45,
          bottom:15
        },
      },
    };

    return {
      labels,
      datasets,
      chartOptions,
      plugins,
      chartRef,
      chartTimestamp,
    };
  },
  components: { Bar },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: this.datasets,
      };
    },
    myStyles() {
      const height = 100//(this.$refs.chart_holder as HTMLDivElement)?.offsetHeight;
      const width = (this.$refs.chart_holder as HTMLDivElement)?.offsetWidth;
      console.log(height)
      console.log(width)
      return {
        height: `${height}%`,
        width: `${width}px`,
        position: "absolute",
      };
    },
  },
});
</script>

<template>
  <div class="chart_container" ref="chart_holder">
    <Bar
      id="chartWidget"
      ref="chartRef"
      :key="chartTimestamp"
      :options="chartOptions"
      :data="chartData"
      :plugins="plugins"
      :style="myStyles"

    />
  </div>
</template>

<style lang="scss" scoped>
.chart_container {
  padding: 0px;
  position: absolute;
  margin: auto;
  left:0;
  right:0;
  top:0;
  bottom:0;
  /*height: 53vh;
  width: 24vw;*/
}

#chart {
  /*width: 100%;
  height: 100%;*/
}
</style>
