<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import "chartjs-adapter-moment";
import BarChartWidgetSettings, {
    type ITChartSettings,
} from "@/plugins/charts/widgets/BarChartWidgetSettings.vue";
import { computed, inject, onMounted, ref, watch } from "vue";
import { useSettings } from "@/composables/widgets/settings";
import { useStoreManager } from "@/composables/storeManager";
import { useStore } from "@/composables/widgets/store";
import type { Store } from "@/stores/Widgets/Store";
import { useSerialization } from "@/composables/widgets/serialization";
import { Bar } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    TimeScale,
    TimeSeriesScale,
    Chart,
    _adapters,
} from "chart.js";
import type { IDataSetSelector } from "@/plugins/charts/widgets/api/DataSetSelector";
import { useDataSetSelector } from "@/plugins/charts/composables/dataSetSelector";
import type {
    Composer,
    Selector,
} from "@/plugins/charts/widgets/api/ChartdataComposer";
import type { TinyEmitter } from "tiny-emitter";
import useChartDataComposer from "@/plugins/charts/composables/ChartDataComposer";
import { CSVComposer } from "@/plugins/charts/impl/CSVComposer";
import { XMLAComposer } from "@/plugins/charts/impl/XMLAComposer";

//import * as dateFns from 'date-fns';
//import * as  dateFnsAdapter  from 'chartjs-adapter-date-fns';

//_adapters._date.override(dateFnsAdapter)

//import {de} from 'date-fns/locale';

const settingsComponent = BarChartWidgetSettings;

const props = withDefaults(defineProps<ITChartSettings>(), {
    dataSets: [] as IDataSetSelector[],
    composer: [],
    axes: {
        x: {
            type: "timeseries",
            offsetAfterAutoskip: true,
            ticks: {
                source: "data",
            },

            backgroundColor: "#fff",
            stacked: false,
            weight: 2,
            reverse: false,
            display: true,
        },
        y: {
            type: "category",
            backgroundColor: "#fff",
            stacked: false,
            weight: 2,
            reverse: false,
            display: true,
        },
    },
    axisAssignment: {},
    test: {},
} as any);
const { settings, setSetting } = useSettings<ITChartSettings>(props);
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
const getStateComposeable = useSerialization(settings).getState;
const { getDataFilterer } = useDataSetSelector();
const stores = ref([]);
const setStore = (store: Store) => {
    console.log("setStore");
    const storeData = useStore<Store>(undefined, undefined, eventbus);
    storeData.setStore(store);
    stores.value.push(storeData);
    return storeData;
};
const getState = () => {
    const state = deepUnref(getStateComposeable() as any);
    for (let index of state.composer) {
        delete index["data"];
    }
    return state;
};
defineExpose({
    setSetting,
    settings,
    settingsComponent,
    setStore,
    getState,
});

onMounted(() => {
    console.log(props);
});

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    TimeScale,
    TimeSeriesScale,
);
Chart.defaults.backgroundColor = "#36A2EB00";
const chartDataComposer = useChartDataComposer();

chartDataComposer.setComposers(settings.value.composer);
watch(
    () => settings.value.composer,
    (composers) => {
        if (composers && composers.length > 0) {
            let InitializedComposerds = [];
            composers.forEach((composer) => {
                if (composer instanceof CSVComposer) {
                    return;
                } else {
                    let composerObj = composer as any;
                    let csvCo = new CSVComposer();
                    csvCo.setSelectorX(composerObj.selectorX);
                    for (let sely of composerObj.selectorY) {
                        csvCo.addSelectorY(sely);
                    }

                    let store = useStoreManager().getStore(
                        composerObj.store.id,
                    );
                    let store2 = setStore(store as Store);
                    csvCo.setStore(store2.store as IStore);
                    csvCo.setData(store2.data);
                    InitializedComposerds.push(csvCo);
                }
            });

            if (InitializedComposerds.length > 0) {
                setSetting("composer", InitializedComposerds);
            }
            //@ts-ignore
            /* props.composer = InitializedComposerds;

       settings.value.composer = InitializedComposerds;
        settings.value = settings.value;*/
        }
        chartDataComposer.setComposers(settings.value.composer);
    },
);

//chartDataComposer.setComposers(settings.value.composer);

const chartData = computed(() => {
    const getAssignment = (from: Selector) => {
        const keys = Object.keys(settings.value.axisAssignment);
        for (let akey of keys) {
            let item = settings.value.axisAssignment[akey].find(
                (e) => e.id == from.id,
            );
            if (item) {
                return akey;
                break;
            }
        }
        return "y";
    };
    if (settings.value.composer && settings.value.composer.length > 0) {
        return {
            labels: chartDataComposer.getDataForMergedAxisX().value.data,
            datasets: chartDataComposer.getDataForAxesY().value.map((e) => {
                return {
                    label: e.title,
                    data: e.data,
                    yAxisID: e.from || "y", // getAssignment(e.from!),
                };
            }),
        };
    } else {
        return {
            labels: [],
            datasets: [{ data: [] }],
        };
    }
});
const chartOptions = computed(() => {
    return {
        responsive: true,
        backgroundColor: "#00000000",
        scales: settings.value.axes,
    };
});
</script>

<template>
    <!--<div class="chart_container" v-if="settings">-->

    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />

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
.cmap_container {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>
<style>
.holder {
    width: 20px;
    height: 20px;
    background-color: #000;
}
</style>
