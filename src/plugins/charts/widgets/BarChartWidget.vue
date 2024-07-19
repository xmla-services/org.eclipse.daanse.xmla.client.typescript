<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>


import BarChartWidgetSettings, {type ITChartSettings} from "@/plugins/charts/widgets/BarChartWidgetSettings.vue";
import {computed, inject, onMounted, ref, watch} from "vue";
import {useSettings} from "@/composables/widgets/settings";
import {useStoreManager} from "@/composables/storeManager";
import {useStore} from "@/composables/widgets/store";
import type {Store} from "@/stores/Widgets/Store";
import {useSerialization} from "@/composables/widgets/serialization";
import { Bar } from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,LogarithmicScale,TimeScale, Chart} from 'chart.js'
import type {IDataSetSelector} from "@/plugins/charts/widgets/api/DataSetSelector";
import {useDataSetSelector} from "@/plugins/charts/composables/dataSetSelector";
import type {Composer, Selector} from "@/plugins/charts/widgets/api/ChartdataComposer";
import type {TinyEmitter} from "tiny-emitter";
import useChartDataComposer from "@/plugins/charts/composables/ChartDataComposer";
import 'chartjs-adapter-date-fns';
import {de} from 'date-fns/locale';


const settingsComponent = BarChartWidgetSettings;

const props = withDefaults(defineProps<ITChartSettings>(), {
    dataSets: [] as IDataSetSelector[],
    composer: [],
    axes: {
        x:{
            type:'category',
            backgroundColor:'#fff',
            stacked:false,
            weight:2,
            reverse:false,
            display:true
        },
        y:{
            type: 'category',
            backgroundColor: '#fff',
            stacked: false,
            weight: 2,
            reverse: false,
            display: true
        }
    },
    axisAssignment:{},
    test:{}
} as any);
const {settings,setSetting}=useSettings<ITChartSettings>(props);
/*setSetting('axes.x',{
    type:'category',
    backgroundColor:'#fff',
    stacked:false,
    weight:2,
    reverse:false,
    display:true
})
setSetting('axes.y',{
    type: 'category',
    backgroundColor: '#fff',
    stacked: false,
    weight: 2,
    reverse: false,
    display: true
})*/
const eventbus = inject("customEventBus") as TinyEmitter;
const { getState } = useSerialization(settings);
const {getDataFilterer} = useDataSetSelector();
const stores = ref([]);
const setStore =(store:Store)=>{
    console.log('setStore')
    const storeData = useStore<Store>(undefined,undefined,eventbus);
    storeData.setStore(store)
    stores.value.push(storeData)
    return storeData;
}
defineExpose({
  setSetting,
  settings,
  settingsComponent,
  setStore,
  getState,
});



onMounted(()=>{});

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,LogarithmicScale,TimeScale)
Chart.defaults.backgroundColor = '#36A2EB00';
const chartDataComposer = useChartDataComposer();

chartDataComposer.setComposers(settings.value.composer);
watch(()=>settings.value.composer,()=>{
    chartDataComposer.setComposers(settings.value.composer);
})

//chartDataComposer.setComposers(settings.value.composer);

const chartData= computed(()=>{

    const getAssignment=(from:Selector)=>{
            const keys = Object.keys(settings.value.axisAssignment);
       for (let akey of keys) {
           let item = settings.value.axisAssignment[akey].find(e=>(e.id==from.id));
           if(item) {
               return akey;
               break
           }
       }
       return 'y';
    }
    if(settings.value.composer.length>0){
        return {
            labels: chartDataComposer.getDataForMergedAxisX().value.data,
            datasets: chartDataComposer.getDataForAxesY().value.map(e=>{
                return {
                    label:e.title,
                    data:e.data,
                    yAxisID:getAssignment(e.from!)
                }
            })
        }
    }else{
        return {
            labels: [],
            datasets: [{data: []}]
        }
    }

});
   const chartOptions= computed(()=>{

       return{
           responsive: true,
           backgroundColor:'#00000000',
           scales:settings.value.axes

       }

});








</script>

<template>
 <!--<div class="chart_container" v-if="settings">-->

      <Bar
          id="my-chart-id"
          :options="chartOptions"
          :data="chartData"
      />

<!--</div>-->
</template>

<style scoped>
.text-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 1rem;
  align-items: stretch;
}

.component {
  overflow: hidden;
}
.cmap_container{
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
<style>
.holder{
  width:20px;
  height:20px;
  background-color: #000;
}
</style>
