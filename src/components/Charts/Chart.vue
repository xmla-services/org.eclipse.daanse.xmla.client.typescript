<script lang="ts">
import { usePivotTableStore } from "@/stores/PivotTable";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";
import { optionalArrayToArray } from "@/utils/helpers";
import { defineComponent, watch, ref, onMounted } from "vue";
import { Bar } from 'vue-chartjs'
//@ts-ignore
import autocolors from 'chartjs-plugin-autocolors';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,Colors } from 'chart.js'
import { storeToRefs } from "pinia";
import { useAppSettingsStore } from "@/stores/AppSettings";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, autocolors)

export default defineComponent({
  setup() {
    // const queryDesignerStore = useQueryDesignerStore();
    const pivotTableStore = usePivotTableStore();
    const { mdx } = storeToRefs(pivotTableStore);
    const appSettings = useAppSettingsStore();
    const api = appSettings.getApi();

    const rows = ref([] as any[]);
    const columns = ref([] as any[]);
    const cells = ref([] as any[]);
    const labels = ref([] as any[]);
    const datasets = ref([] as any[]);

    const chartOptions = {
      responsive: true,
    };
    const plugins = [autocolors];

    const getData = async () => {
      const loadingId = appSettings.setLoadingState();

      const mdx = pivotTableStore.mdx;
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
        return optionalArrayToArray(e.Member);
      });
      rows.value = axis1.map((e: { Member: any }) => {
        return optionalArrayToArray(e.Member);
      });
      cells.value = parseCells(cellsArray, columns.value, rows.value);

      datasets.value = rows.value.map((row,ind)=>{
        return {
          'label': row.map(e=>e.Caption).join('/'),
          'data': cells.value![ind].map(v=>parseFloat(v.FmtValue))
        }
      });
      
      labels.value = columns.value.map(e=>e.map(f=>f.Caption).join('/'));
      appSettings.removeLoadingState(loadingId);
    };

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

    return {
      labels,
      datasets,
      chartOptions,
      plugins,
    }
  },
  components: { Bar },
  computed: {
    chartData(){
      return {
        labels: this.labels,
        datasets: this.datasets
      }
    },
    myStyles () {
      const height = (this.$refs.chart_holder as HTMLDivElement)?.offsetHeight;
      return {
        height: `${height}px`,
        position: 'relative'
      }
    }
  },
});
</script>

<template>
  <div class="chart_container" ref="chart_holder">
    <Bar
        id="chart"
        :options="chartOptions"
        :data="chartData"
        :plugins="plugins"
        :style="myStyles"
    />
  </div>
</template>

<style lang="scss">
.chart_container {
  padding: 30px;
  height: 100%;
}

#chart{
  width:100%;
  height:100%;
}
</style>
