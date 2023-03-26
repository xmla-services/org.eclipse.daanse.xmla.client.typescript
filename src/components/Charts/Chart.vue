<script lang="ts">
import { usePivotTableStore } from "@/stores/PivotTable";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";
import { optionalArrayToArray } from "@/utils/helpers";
import {defineComponent} from "vue";
import { Bar } from 'vue-chartjs'
//@ts-ignore
import autocolors from 'chartjs-plugin-autocolors';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,Colors } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, autocolors)

export default defineComponent({
  setup() {
    const queryDesignerStore = useQueryDesignerStore();
    const pivotTableStore = usePivotTableStore();

    queryDesignerStore.$subscribe(
      () => {
        pivotTableStore.fetchPivotTableData();
      },
      { detached: true }
    );
    return {
      pivotTableStore,
      queryDesignerStore,
    };
  },
  components: { Bar },
  computed: {


    columns() {
      const cols = this.pivotTableStore.state.columns.map((e: { Member: any }) => {
        return optionalArrayToArray(e.Member);
      });

      return cols;
    },
    labels(){
      return this.columns.map(e=>e.map(f=>f.Caption).join('/'));
    },

    rows() {
      const rows = this.pivotTableStore.state.rows.map((e: { Member: any }) => {
        return optionalArrayToArray(e.Member);
      });

      return rows;
      // return this.pivotTableStore.rows;
    },


    cellsParsed() {
      if (!this.pivotTableStore.state.cells.length) return;
      if (
        !this.pivotTableStore.state.rows.length ||
        !this.pivotTableStore.state.columns.length
      ) {
        if (
          this.pivotTableStore.state.rows.length ===
          this.pivotTableStore.state.columns.length
        ) {
          return [this.pivotTableStore.state.cells];
        }
        return [];
      }

      const cp = [...this.pivotTableStore.state.cells];
      const result = [] as any[][];
      const colsArray = [];
      const count = this.pivotTableStore.state.rows.length;

      while (cp.length) {
        colsArray.push(cp.splice(0, count));
      }

      for (let j = 0; j < colsArray[0].length; j++) {
        const tmp = [] as any[];
        for (let i = 0; i < colsArray.length; i++) {
          tmp.push(colsArray[i][j]);
        }

        result.push(tmp);
      }

      return result;
    },
    datasets(){
      return this.rows.map((row,ind)=>{
        return {
          'label':  row.map(e=>e.Caption).join('/'),
          'data': this.cellsParsed![ind].map(v=>parseFloat(v.FmtValue))
        }
      })
    },
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

  mounted(){
  },
  data() {
    return {

      chartOptions: {
        responsive: true
      },
      plugins:[autocolors]
    }
  }

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
