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
import CSVComposerV from "@/plugins/charts/widgets/parts/CSVComposerV.vue";
import XMLAComposer from "@/plugins/charts/widgets/parts/XMLAComposerV.vue";
import { clone } from "lodash";
import { deepUnref } from "vue-deepunref";

export interface AxisSettings {
    type: string;
    backgroundColor: string;
    stacked: boolean;
    weight: number;
    reverse: boolean;
    display: boolean;
}
export interface ITChartSettings {
    baseMapUrl: string;
    dataSets: IDataSetSelector[];
    composer: Composer<Selector>[];
    axes: {
        x: AxisSettings;
        y: AxisSettings;
        y2: AxisSettings;
        [key: string]: AxisSettings;
    };
    axisAssignment: { [key: string]: Composer<any> };
}

interface IChartComponent {
    store: Store | XMLAStore;
    settings: ITChartSettings;
    setSetting: (key: string, value: any) => void;
    setStore: (store: Store | XMLAStore) => any;
}

const { component } = defineProps<{ component: IChartComponent }>();

const opened = ref({
    mapSection: false,
    storeSection: false,
    RenderSection: false,
});

// TODO: Move to store selection component
const storeManager = useStoreManager();

const requestResult = ref("");

const getStores = computed(() => {
    const storeList = storeManager.getStoreList();
    return Array.from(storeList.value.values());
});

const addComposer = (store: IStore) => {
    console.log("add ");
    console.log("add ");

    console.log(store);
    if (store.type === "XMLA") {
        component.setStore(store as XMLAStore);
        const xmlaComposer = new XMLAComposer();
        xmlaComposer.setStore(store as XMLAStore);
        console.log(xmlaComposer);

        const val = [...toRaw(unref(component.settings.composer))];
        val.push(xmlaComposer);
        component.setSetting("composer", val);
    } else if (store.type === "CSV") {
        const storeData = component.setStore(store as Store);
        const csvComposer = new CSVComposer();

        csvComposer.setStore(storeData.store);
        csvComposer.setData(storeData.data);

        /*csvComposer.setSelectorX({
        header:'item'
    }as CSVSelector)
    csvComposer.addSelectorY({
        header:'markets'
    }as CSVSelector)*/
        /*csvComposer.addSelectorY({
        header:'bj'
    }as CSVSelector)*/

        /*const val = [ ...deepUnref(component.settings.composer as any)];
    val.push(csvComposer)
    component.setSetting('composer',val);*/
        const val = [...toRaw(unref(component.settings.composer))];
        val.push(csvComposer);
        //console.log(component.settings.composer.push(2));
        component.setSetting("composer", val);
        //component.settings.composer.push(csvComposer);
        /*let list = component.settings.composer;
    list.push(csvComposer)*/
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
        type: "category",
        backgroundColor: "#fff",
        stacked: false,
        weight: 2,
        reverse: false,
        display: true,
    };
    //component.setSetting('axes',axis);
}
onMounted(() => {});

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
    <va-collapse v-model="opened.mapSection" header="Axes">
        <div class="settings-container">
            <div class="settings-block" v-if="component">
                <h2>x-Axis:</h2>

                <VaSelect
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
                <VaColorInput v-model="axes.x.backgroundColor" label="color">
                </VaColorInput>
                <br />
                <VaSwitch label="stacked" v-model="axes.x.stacked" /><br />
                <VaSwitch label="reverse" v-model="axes.x.reverse" /><br />
                <VaSwitch
                    label="display"
                    left-label
                    v-model="axes.x.display"
                /><br />
                <VaInput v-model="axes.x.weight" label="weight"> </VaInput>

                <br />
                <h2>y-Axis:</h2>
                <br />

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
                <VaColorInput v-model="axes.y.backgroundColor" label="color">
                </VaColorInput>
                <br />
                <VaSwitch label="stacked" v-model="axes.y.stacked" /><br />
                <VaSwitch label="reverse" v-model="axes.y.reverse" /><br />
                <VaSwitch
                    label="display"
                    left-label
                    v-model="axes.y.display"
                /><br />
                <VaInput v-model="axes.y.weight" label="weight"> </VaInput>
                <br />

                <div
                    v-for="additionanl_name in axis_names"
                    :key="additionanl_name"
                >
                    <h2>{{ additionanl_name }}</h2>
                    <VaSelect
                        v-model="axes[additionanl_name].type"
                        :options="['time', 'linear', 'logarithmic', 'category']"
                        placeholder="Select an header for X"
                    />
                    <VaColorInput
                        v-model="axes[additionanl_name].backgroundColor"
                        label="color"
                    >
                    </VaColorInput>
                    <br />
                    <VaSwitch
                        label="stacked"
                        v-model="axes[additionanl_name].stacked"
                    /><br />
                    <VaSwitch
                        label="reverse"
                        v-model="axes[additionanl_name].reverse"
                    /><br />
                    <VaSwitch
                        label="display"
                        left-label
                        v-model="axes[additionanl_name].display"
                    /><br />
                    <VaInput
                        v-model="axes[additionanl_name].weight"
                        label="weight"
                    >
                    </VaInput>
                </div>
            </div>
            <VaButton @click="addAxis()"> Add+ </VaButton>
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
                            <VaListItem
                                v-for="store in getStores"
                                @click="addComposer(store)"
                            >
                                {{ store.caption }}
                            </VaListItem>
                        </VaList>
                    </VaDropdownContent>
                </VaDropdown>
            </div>
            <div
                class="composers"
                v-for="(composer, i) in component.settings.composer"
            >
                <template v-if="composer instanceof CSVComposer">
                    <CSVComposerV
                        :modelValue="component.settings.composer[i]"
                        :axes="component.settings.axes"
                        :component="component"
                    ></CSVComposerV>
                </template>
                <template v-if="composer instanceof XMLAComposer">
                    <XMLAComposerV
                        :modelValue="component.settings.composer[i]"
                        :axes="component.settings.axes"
                        :component="component"
                    ></XMLAComposerV>
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

.text-title {
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
