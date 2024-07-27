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
import { Bar, Line } from "vue-chartjs";
import { deepUnref } from "vue-deepunref";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
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
import { reverse } from "lodash";

//import * as dateFns from 'date-fns';
//import * as  dateFnsAdapter  from 'chartjs-adapter-date-fns';

//_adapters._date.override(dateFnsAdapter)

//import {de} from 'date-fns/locale';

const settingsComponent = BarChartWidgetSettings;

const chartComponent = computed(() => {
    switch (settings.value.chartType) {
        case 'Line':
            return Line;
        default:
            return Bar;
    }
});


const props = withDefaults(defineProps<ITChartSettings>(), {
    dataSets: [] as IDataSetSelector[],
    composer: [],
    chartType: "Bar",
    title: "Some chart",
    titlePosition: "top",
    legendPosition: "top",
    borderColor: '#000000',
    canvasBackgroundColor: "#ffffff",
    dataSetBackgroundColors: () => ["#ff0000", "#00ff00", "#0000ff"],
    axes: {
        x: {
            text: "X",
            position: "bottom",
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
            grid: {
                display: true,
                color: "#ccc",
                thickness: 1,
                tickMarksColor: "#ccc",
            },
            ticks: {
                color: "#000",
            }
        },
        y: {
            text: "Y",
            position: "left",
            type: "linear",
            backgroundColor: "#fff",
            stacked: false,
            weight: 2,
            reverse: false,
            display: true,
            grid: {
                display: true,
                color: "#ccc",
                thickness: 1,
                tickMarksColor: "#ccc",
            },
            ticks: {
                color: "#000",
            }
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
    const storeData = useStore<Store>(eventbus);
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

onMounted(() => {});

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
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
                } else if (composer instanceof XMLAComposer) {
                    return;
                } else {
                    let composerObj = composer as any;
                    if (composer.type === "XMLA") {
                        let xmlaCo = new XMLAComposer();

                        let store = useStoreManager().getStore(
                            composerObj.store.id,
                        );
                        let configuredStore = setStore(store as Store);
                        xmlaCo.setStore(configuredStore.store.value as IStore);

                        xmlaCo.restoreState(composerObj);
                        InitializedComposerds.push(xmlaCo);
                    } else {
                        let csvCo = new CSVComposer();
                        csvCo.setSelectorX(composerObj.selectorX);
                        for (let sely of composerObj.selectorY) {
                            // csvCo.addSelectorY(sely);
                        }

                        let store = useStoreManager().getStore(
                            composerObj.store.id,
                        );
                        let store2 = setStore(store as Store);
                        csvCo.setStore(store2.store as IStore);
                        csvCo.setData(store2.data);
                        InitializedComposerds.push(csvCo);
                    }
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
                    borderWidth: 2,
                    backgroundColor: settings.value.dataSetBackgroundColors,
                    borderColor: settings.value.borderColor,
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
    const config = {
        plugins: {
            title: {
            display: true,
            text: settings.value.title,
            position: settings.value.titlePosition,
        },
            legend: {
                position: settings.value.legendPosition,
            },
        },
        responsive: true,
        // backgroundColor: "#00000000",
        scales: {
            x: {
                display: settings.value.axes.x.display,
                type: settings.value.axes.x.type,
                position: settings.value.axes.x.position,
                reverse: settings.value.axes.x.reverse,
                stacked: settings.value.axes.x.stacked,
                backgroundColor: settings.value.axes.x.backgroundColor,
                title: {
                    display: true,
                    text: settings.value.axes.x.text,
                },
                ticks: {
                    // callback: (val, index) => settings.value.axes.x.grid.tickTemplate.replace('{value}', chartData.value.labels[index]),
                    color: settings.value.axes.x.ticks.color,
                },
                grid: {
                    display: settings.value.axes.x.grid.display,
                    color: settings.value.axes.x.grid.color,
                    lineWidth: settings.value.axes.x.grid.thickness,
                    // tickBorderDash: settings.value.axes.x.grid.dash,
                    // tickBorderDashOffset: settings.value.axes.x.grid.dashOffset,
                    tickColor: settings.value.axes.x.grid.tickMarksColor,
                }
            },
            y: {
                display: settings.value.axes.y.display,
                type: settings.value.axes.y.type,
                position: settings.value.axes.y.position,
                reverse: settings.value.axes.y.reverse,
                stacked: settings.value.axes.y.stacked,
                backgroundColor: settings.value.axes.y.backgroundColor,
                title: {
                    display: true,
                    text: settings.value.axes.y.text,
                },
                ticks: {
                    // callback: (val, index) => settings.value.axes.y.grid.tickTemplate.replace('{value}', chartData.value.labels[index]),
                    color: settings.value.axes.y.ticks.color,
                },
                grid: {
                    display: settings.value.axes.y.grid.display,
                    color: settings.value.axes.y.grid.color,
                    lineWidth: settings.value.axes.y.grid.thickness,
                    // tickBorderDash: settings.value.axes.y.grid.dash,
                    // tickBorderDashOffset: settings.value.axes.y.grid.dashOffset,
                    tickColor: settings.value.axes.y.grid.tickMarksColor,
                }
            },
        }
    };
    if (settings.value.axes.y2) {
        config.scales.y2 = settings.value.axes.y2;
    }
    return config;
});
</script>

<template>
    <!--<div class="chart_container" v-if="settings">-->

    <component :is="chartComponent" :data="chartData" :options="chartOptions"/>

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

canvas {
    background-color: v-bind(settings.canvasBackgroundColor);
}
</style>
<style>
.holder {
    width: 20px;
    height: 20px;
    background-color: #000;
}
</style>
