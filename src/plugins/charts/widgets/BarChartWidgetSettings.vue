<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { ref, type Ref, onMounted, computed, unref, toRaw, watch } from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";

import type { XMLAStore } from "@/stores/Widgets/XMLAStore";
import type { IDataSetSelector } from "@/plugins/charts/widgets/api/DataSetSelector";
import type {
    Composer,
    CSVSelector,
    Selector,
} from "@/plugins/charts/widgets/api/ChartdataComposer";
import { CSVComposer } from "@/plugins/charts/impl/CSVComposer";
import { XMLAComposer } from "@/plugins/charts/impl/XMLAComposer";
import CSVComposerV from "@/plugins/charts/widgets/parts/CSVComposerV.vue";
import XMLAComposerV from "@/plugins/charts/widgets/parts/XMLAComposerV.vue";
import { clone } from "lodash";
import { deepUnref } from "vue-deepunref";
import useComposerManager from "@/plugins/charts/composables/ComposerManager";

export interface AxisSettings {
    type: string;
    text: string;
    backgroundColor: string;
    stacked: boolean;
    weight: number;
    reverse: boolean;
    display: boolean;
    grid: GridSettings;
    ticks: TicksSettings;
    tickTemplate: string;
    position?: string;
}

export interface GridSettings {
    display: boolean;
    color: string;
    thickness: number;
    // dash: number[];
    // dashOffset: number;
    tickMarksColor: string;
}

export interface TicksSettings {
    color: string;
}

export interface ITChartSettings {
    chartType: string;
    title: string;
    titlePosition: string;
    legendPosition: string,
    borderColor: string;
    canvasBackgroundColor: string;
    dataSetBackgroundColors: string[];
    baseMapUrl: string;

    composer:Composer<Selector>[];
    axes:{
        x:AxisSettings,
        y:AxisSettings,
        y2:AxisSettings,
        [key: string]:AxisSettings
    }
}

interface IChartComponent {
    store: Store | XMLAStore;
    settings: ITChartSettings;
    setSetting: (key: string, value: any) => void;
    setStore: (store: Store | XMLAStore) => any;
}

const { component } = defineProps<{ component: IChartComponent }>();

const opened = ref({
    mainSection: false,
    mapSection: false,
    storeSection: false,
    RenderSection: false,
    gridSection: false,
});

// TODO: Move to store selection component
const storeManager = useStoreManager();

const requestResult = ref("");

const backgroundColors = ref(component.settings.dataSetBackgroundColors.map(color => {
  return {
    color,
    transparency: 99,
  };
}));

const getStores = computed(() => {
    const storeList = storeManager.getStoreList();
    return Array.from(storeList.value.values());
});

const addComposer = (store: IStore) => {
    console.log("add ");
    const ComposerClass = useComposerManager().getComposerForStoreType(
        store.type,
    );
    const storeData = component.setStore(store as Store);
    if (ComposerClass) {
        const aComposer = new ComposerClass();
        aComposer.setStore(storeData.store);
        aComposer.setData(storeData.data);

        const val = [...toRaw(unref(component.settings.composer))];
        val.push(aComposer);
        component.setSetting("composer", val);
    }
};
const axis_names = computed(() => {
    //console.log(component.value.settings);
    return Object.keys(component.settings.axes).filter(
        (name) => name !== "y" && name != "x",
    );
});
function addAxis() {
    let name = "y2";

    //component.setSetting('axes.'+name,{
    //let axis =  clone(toRaw(unref(component.settings.axes)));
    axes.value[name] = {
        title: {
            display: true,
            text: "Y2",
        },
        ticks: {
            color: "#000"
        },
        type: "category",
        backgroundColor: "#fff",
        stacked: false,
        weight: 2,
        reverse: false,
        display: true,
        position: "right",
    };
    component.setSetting(`axes.${name}`, axes.value[name]);
}
onMounted(() => {});

const updateBgc = (index, newColor) => {
    backgroundColors.value[index].color = newColor;
    component.settings.dataSetBackgroundColors = backgroundColors.value.map(
        bgc => `${bgc.color}${bgc.transparency.toString().padStart(2, '0')}`
    );
};

const updateTransparency = (index, newTransparency) => {
    backgroundColors.value[index].transparency = newTransparency;
    component.settings.dataSetBackgroundColors = backgroundColors.value.map(
        bgc => `${bgc.color}${bgc.transparency.toString().padStart(2, '0')}`
    );
};

const addBgc = () => {
    backgroundColors.value.push({ color: "", transparency: 99 });
};

const deleteBgc = (id: number) => {
    backgroundColors.value.splice(id, 1);
};

watch(
    backgroundColors.value,
        (nV) => {
            component.settings.dataSetBackgroundColors = nV.map(bgc => bgc.color + bgc.transparency);
        },
        { deep: true }
);

const axes = ref({});
watch(
    component.settings.axes,
    (axis) => {
        axes.value = { ...deepUnref(axis as any) };
    },
    { immediate: true, deep: true },
);
watch(
    axes,
    (axis) => {
        component.setSetting("axes", axis);
    },
    { deep: true },
);
</script>

<template>
    <va-collapse v-model="opened.mainSection" header="Chart">
        <div class="settings-block mb-3">
            <va-select
                label="Chart Type:"
                :model-value="component.settings.chartType"
                @update:model-value="component.setSetting('chartType', $event)"
                :options="['Bar', 'Line']"
            />
        </div>
        <div class="settings-block mb-3">
              <va-input
                class="title-input"
                label="Title:"
                :model-value="component.settings.title"
                @update:model-value="component.setSetting('title', $event)"
              />
        </div>
        <div class="settings-block mb-3">
              <va-select
                label="Title position:"
                :model-value="component.settings.titlePosition"
                @update:model-value="component.setSetting('titlePosition', $event)"
                :options="['top', 'left', 'bottom', 'right']"
              />
        </div>
        <div class="events-list-label mb-3">
            <h3>Datasets background colors</h3>
                <va-button
                    icon="add"
                    @click="addBgc"
                >
                </va-button>
        </div>
        <div
            v-for="(bgc, index) in backgroundColors"
            :key="index"
            class="background-colors-block mb-3"
        >
            <va-color-input
                class="color-input"
                :model-value="bgc.color"
                @update:model-value="updateBgc(index, $event)"
                label="Background color"
            />
            <va-input
                class="transparency-input ml-2"
                :model-value="bgc.transparency"
                @update:model-value="updateTransparency(index, $event)"
                label="Transparency"
            />
            <va-button
                class="delete-btn mt-3 ml-2"
                preset="plain"
                icon="delete"
                icon-color="#ff0000"
                @click="deleteBgc(index)"
            />
        </div>
        <div class="settings-block mb-3">
            <va-select
                label="Legend position:"
                :model-value="component.settings.legendPosition"
                @update:model-value="component.setSetting('legendPosition', $event)"
                :options="['top', 'left', 'bottom', 'right', 'chartArea']"
            />
        </div>
        <div class="settings-block mb-3">
            <va-color-input
                class="color-input"
                label="Border color:"
                :model-value="component.settings.borderColor"
                @update:model-value="component.setSetting('borderColor', $event)"
            />
        </div>
        <div class="settings-block mb-3">
            <va-color-input
                class="color-input"
                label="Canvas background color:"
                :model-value="component.settings.canvasBackgroundColor"
                @update:model-value="component.setSetting('canvasBackgroundColor', $event)"
            />
        </div>
    </va-collapse>
    <va-collapse v-model="opened.mapSection" header="Axes">
        <div class="settings-container">
            <div class="settings-block" v-if="component">
                <h2 class="mb-2">x-Axis:</h2>

                <div class="settings-block mb-3">
                    <VaSelect
                        label="Type"
                        v-if="axes.x"
                        v-model="axes.x.type"
                        :options="[
                            'timeseries',
                            'linear',
                            'logarithmic',
                            'category',
                        ]"
                        placeholder="Select an header for X"
                    />
                </div>
                <div class="settings-block mb-3">
                    <VaColorInput
                        v-model="axes.x.backgroundColor"
                        label="color"
                    />
                </div>
                <div class="settings-block mb-3" >
                    <VaSwitch
                        label="stacked"
                        :model-value="component.settings.axes.x.stacked"
                        @update:model-value="component.setSetting('axes.x.stacked', $event)"
                    />
                </div>
                <div class="settings-block mb-3">
                    <VaSwitch
                        label="reverse"
                        v-model="axes.x.reverse"
                    />
                </div>
                <div class="settings-block mb-3">
                    <VaSwitch
                        label="display"
                        left-label
                        v-model="axes.x.display"
                    />
                </div>
                <div class="settings-block mb-3">
                    <VaInput
                        v-model="axes.x.weight"
                        label="weight"
                    />
                </div>
                <div class="settings-block mb-3">
                    <VaInput
                        label="title"
                        :model-value="component.settings.axes.x.text"
                        @update:model-value="component.setSetting('axes.x.text', $event)"
                    />
                </div>
                <div class="settings-block mb-3">
                    <VaSelect
                        label="Position"
                        :model-value="component.settings.axes.x.position"
                        @update:model-value="component.setSetting('axes.x.position', $event)"
                        :options="['top', 'bottom']"
                        placeholder="Position"
                    />
                </div>
                <h2 class="mt-3 mb-2">y-Axis:</h2>
                <div class="settings-block mb-3">
                    <VaSelect
                        v-model="axes.y.type"
                        :options="[
                            'timeseries',
                            'linear',
                            'logarithmic',
                            'category',
                        ]"
                        placeholder="Select an header for X"
                    />
                </div>
                <div class="settings-block mb-3">
                    <VaColorInput
                    v-model="axes.y.backgroundColor"
                    label="color"
                />
                </div>
                <div class="settings-block mb-3">
                    <VaSwitch
                        label="stacked"
                        v-model="axes.y.stacked"
                    />
                </div>
                <div class="settings-block mb-3">
                    <VaSwitch
                        label="reverse"
                        v-model="axes.y.reverse"
                    />
                </div>
                <div class="settings-block mb-3">
                    <VaSwitch
                        label="display"
                        left-label
                        v-model="axes.y.display"
                    />
                </div>
                <div class="settings-block mb-3">
                    <VaInput
                    v-model="axes.y.weight"
                    label="weight"
                />
                </div>
                <div class="settings-block mb-3">
                    <VaInput
                        label="title"
                        :model-value="component.settings.axes.y.text"
                        @update:model-value="component.setSetting('axes.y.text', $event)"
                    />
                </div>
                <div class="settings-block mb-3">
                    <VaSelect
                        label="Position"
                        :model-value="component.settings.axes.y.position"
                        @update:model-value="component.setSetting('axes.y.position', $event)"
                        :options="['left', 'right']"
                        placeholder="Position"
                    />
                </div>

                <div
                    v-for="additional_name in axis_names"
                    :key="additional_name"
                >
                    <h2 class="mt-3 mb-2">{{ additional_name }}:</h2>
                    <div class="settings-block mb-3">
                        <VaSelect
                            v-model="axes[additional_name].type"
                            :options="['time', 'linear', 'logarithmic', 'category']"
                            placeholder="Select an header for X"
                        />
                    </div>
                    <div class="settings-block mb-3">
                        <VaColorInput
                            v-model="axes[additional_name].backgroundColor"
                            label="color"
                        />
                    </div>
                    <!-- <div class="settings-block mb-3">
                        <VaInput
                            label="title"
                            v-model="axes[additional_name].text"
                        />
                    </div> -->
                    <div class="settings-block mb-3">
                        <VaSwitch
                            label="stacked"
                            v-model="axes[additional_name].stacked"
                        />
                    </div>
                    <div class="settings-block mb-3">
                        <VaSwitch
                            v-model="axes[additional_name].reverse"
                        />
                    </div>
                    <div class="settings-block mb-3">
                        <VaSwitch
                            label="display"
                            left-label
                            v-model="axes[additional_name].display"
                        />
                    </div>
                    <div class="settings-block mb-3">
                        <VaInput
                            v-model="axes[additional_name].weight"
                            label="weight"
                        />
                    </div>
                    <div class="settings-block mb-3">
                        <VaInput
                            label="title"
                            v-model="axes[additional_name].title.text"
                        />
                    </div>
                    <div class="settings-block mb-3">
                        <VaSelect
                            label="Position"
                            v-model="axes[additional_name].position"
                            :options="['left', 'right']"
                            placeholder="Position"
                        />
                    </div>
                    <div class="settings-block mb-3">
                        <va-color-input
                            class="axis-color"
                            label="Color y ticks:"
                            v-model="axes[additional_name].ticks.color"
                        />
                    </div>
                    <div class="settings-block mb-3">
                        <va-color-input
                            class="axis-color"
                            label="Color:"
                            v-model="axes[additional_name].backgroundColor"
                        />
                    </div>
                    <!-- <VaInput
                        label="title"
                        :model-value="component.settings.axes[additional_name].text"
                        @update:model-value="component.setSetting(`axes.${additional_name}.text`, $event)"
                    />
                    <VaSelect
                        label="Position"
                        :model-value="component.settings.axes[additional_name].position"
                        @update:model-value="component.setSetting(`axes.${additional_name}.position`, $event)"
                        :options="['left', 'right']"
                        placeholder="Position"
                    /> -->
                </div>
            </div>
            <VaButton @click="addAxis()"> Add+ </VaButton>
        </div>
    </va-collapse>
    <va-collapse v-model="opened.gridSection" header="Grid">
        <div class="settings-container">
            <div class="settings-block mb-3">
                <va-switch
                    label="Display X Grid Lines:"
                    :model-value="component.settings.axes.x.grid.display"
                    @update:model-value="component.setSetting('axes.x.grid.display', $event)"
                />
            </div>
            <div class="settings-block mb-3">
                <va-color-input
                    class="axis-color"
                    label="Color x grid:"
                    :model-value="component.settings.axes.x.grid.color"
                    @update:model-value="component.setSetting('axes.x.grid.color', $event)"
                />
            </div>
            <div class="settings-block mb-3">
                <va-input
                    label="Thickness x grid:"
                    :model-value="component.settings.axes.x.grid.thickness"
                    @update:model-value="component.setSetting('axes.x.grid.thickness', $event)"
                />
            </div>
                <!-- <div class="settings-block mb-3">
                <va-input
                    label="Dash x grid:"
                    :model-value="component.settings.X_gridLines.dash.join(' ')"
                    @update:model-value="component.setSetting('X_gridLines.dash', $event.split(' ').map(v=> Number(v)))"
                />
                </div>
                <div class="settings-block mb-3">
                <va-input
                    label="Dash Offset x grid:"
                    :model-value="component.settings.X_gridLines.dashOffset"
                    @update:model-value="component.setSetting('X_gridLines.dashOffset', $event)"
                />
                </div> -->
            <div class="settings-block mb-3">
                <va-color-input
                    class="axis-color"
                    label="Color x tick marks:"
                    :model-value="component.settings.axes.x.grid.tickMarksColor"
                    @update:model-value="component.setSetting('axes.x.grid.tickMarksColor', $event)"
                />
            </div>
            <div class="settings-block mb-3">
                <va-color-input
                    class="axis-color"
                    label="Color x ticks:"
                    :model-value="component.settings.axes.x.ticks.color"
                    @update:model-value="component.setSetting('axes.x.ticks.color', $event)"
                />
            </div>
            <!-- <div class="settings-block mb-3">
                <va-input
                    label="Tick Template:"
                    :model-value="component.settings.axes.x.tickTemplate"
                    @update:model-value="component.setSetting('axes.x.tickTemplate', $event)"
                />
            </div> -->
            <div class="settings-block mb-3">
                <va-switch
                    label="Display Y Grid Lines:"
                    :model-value="component.settings.axes.y.grid.display"
                    @update:model-value="component.setSetting('axes.y.grid.display', $event)"
                />
            </div>
            <div class="settings-block mb-3">
                <va-color-input
                    class="axis-color"
                    label="Color y grid:"
                    :model-value="component.settings.axes.y.grid.color"
                    @update:model-value="component.setSetting('axes.y.grid.color', $event)"
                />
            </div>
            <div class="settings-block mb-3">
                <va-input
                    label="Thickness y grid:"
                    :model-value="component.settings.axes.y.grid.thickness"
                    @update:model-value="component.setSetting('axes.y.grid.thickness', $event)"
                />
            </div>
                <!-- <div class="settings-block mb-3">
                <va-input
                    label="Dash y grid:"
                    :model-value="component.settings.Y_gridLines.dash.join(' ')"
                    @update:model-value="component.setSetting('Y_gridLines.dash', $event.split(' ').map(v=> Number(v)))"
                />
                </div>
                <div class="settings-block mb-3">
                <va-input
                    label="Dash Offset y grid:"
                    :model-value="component.settings.Y_gridLines.dashOffset"
                    @update:model-value="component.setSetting('Y_gridLines.dashOffset', $event)"
                />
                </div> -->
            <div class="settings-block mb-3">
                <va-color-input
                    class="axis-color"
                    label="Color y tick marks:"
                    :model-value="component.settings.axes.y.grid.tickMarksColor"
                    @update:model-value="component.setSetting('axes.y.grid.tickMarksColor', $event)"
                />
            </div>
            <div class="settings-block mb-3">
                <va-color-input
                    class="axis-color"
                    label="Color y ticks:"
                    :model-value="component.settings.axes.y.ticks.color"
                    @update:model-value="component.setSetting('axes.y.ticks.color', $event)"
                />
            </div>
            <!-- <div class="settings-block mb-3">
                <va-input
                    label="Tick Template:"
                    :model-value="component.settings.axes.y.tickTemplate"
                    @update:model-value="component.setSetting('axes.y.tickTemplate', $event)"
                />
            </div> -->
        </div>
    </va-collapse>
    <va-collapse v-model="opened.RenderSection" header="Data" v-if="component">
        <div class="settings-container">
            <div class="settings-block">
                <!--<DataSetPropertyList  v-model="component.settings.dataSets" @updatev-model="value => component.setSetting('dataSets',value)"></DataSetPropertyList>-->
                <VaDropdown>
                    <template #anchor>
                        <VaButton> Add+ </VaButton>
                    </template>

                    <VaDropdownContent>
                        <VaList>
                            <template v-for="store in getStores">
                                <VaListItem
                                    v-if="
                                        useComposerManager().isRegistered(
                                            store.type,
                                        )
                                    "
                                    @click="addComposer(store)"
                                >
                                    {{ store.caption }}
                                </VaListItem>
                            </template>
                        </VaList>
                    </VaDropdownContent>
                </VaDropdown>
            </div>
            <div
                class="composers"
                v-for="(composer, i) in component.settings.composer"
            >
                <template v-if="composer instanceof XMLAComposer">
                    <XMLAComposerV
                        :modelValue="component.settings.composer[i]"
                        :axes="component.settings.axes"
                        :component="component"
                    ></XMLAComposerV>
                </template>
                <template v-else>
                    <CSVComposerV
                        :modelValue="component.settings.composer[i]"
                        :axes="component.settings.axes"
                        :component="component"
                    ></CSVComposerV>
                </template>
            </div>
        </div>
    </va-collapse>
</template>
<style lang="scss" scoped>
.settings-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
}

.settings-block {
    display: flex;
    flex-direction: column;
}

.background-colors-block {
    display: flex;
    flex-direction: row;
}

.transparency-input {
    width: 120px;
}

.text-title,
.title-input,
.color-input {
    width: 100%;
}

.text-size {
    width: 63px;
    margin-left: 12px;
}

.text-color {
    width: 156px;
}

.text-weight {
    width: 100px;
}

.align-buttons-group {
    display: flex;
    align-items: flex-end;

    .button-group {
        padding: 2px;
    }

    .align-button {
        &:hover {
            --va-background-color: rgb(162, 181, 218) !important;
        }

        &:nth-child(4) {
            // padding-left: 10px;
        }
    }
}
</style>
