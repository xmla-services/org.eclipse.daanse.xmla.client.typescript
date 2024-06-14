<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { onMounted, ref, type Ref, watch } from "vue";
import { useStoreManager } from "@/composables/storeManager";
import MeasureSelectionModal from "@/components/Modals/MeasureSelectionModal.vue";
import AxisSelectionModal from "@/components/Modals/AxisSelectionModal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const storeSelectionOpened = ref(false);
const props = defineProps(["component"]) as any;
const storeId = ref(props.component.storeId);
const storeManager = useStoreManager();

const selectedMeasures = ref([] as MDSchemaMeasure[]);
const selectedRows = ref([] as MDSchemaHierarchy[]);
const selectedCols = ref([] as MDSchemaHierarchy[]);

const measureSelectionModal = ref() as Ref<any>;
const axisSelectionModal = ref() as Ref<any>;

let stores = ref([]) as Ref<any[]>;

const getStores = () => {
    const storeList = storeManager.getStoreList();

    stores.value = Array.from(storeList.value, function (entry) {
        return { ...entry[1] };
    });
};

const updateStore = async (storeIdSelected) => {
    storeId.value = storeIdSelected;
    props.component.storeId = storeId.value;
};

const openMeasureSelectionModal = async (store) => {
    const storeObj = storeManager.getStore(store.id);
    selectedMeasures.value = await measureSelectionModal.value.run({
        store: storeObj,
        selectedMeasures: selectedMeasures.value,
    });
};

const openAxisSelectionModal = async (axis, store) => {
    const storeObj = storeManager.getStore(store.id);

    const selectedHierarchies = await axisSelectionModal.value.run({
        store: storeObj,
        selectedHierarchies:
            axis === "rows" ? selectedRows.value : selectedCols.value,
    });

    if (axis === "rows") {
        selectedRows.value = selectedHierarchies;
    } else {
        selectedCols.value = selectedHierarchies;
    }
};

const removeMeasure = (measureUniqueName) => {
    selectedMeasures.value = selectedMeasures.value.filter(
        (measure) => measure.MEASURE_UNIQUE_NAME !== measureUniqueName,
    );
};

const removeFromAxis = (axis, hierarchyUniqueName) => {
    if (axis === "rows") {
        selectedRows.value = selectedRows.value.filter(
            (hierarchy) =>
                hierarchy.HIERARCHY_UNIQUE_NAME !== hierarchyUniqueName,
        );
    } else {
        selectedCols.value = selectedCols.value.filter(
            (hierarchy) =>
                hierarchy.HIERARCHY_UNIQUE_NAME !== hierarchyUniqueName,
        );
    }
};

watch(
    selectedMeasures,
    () => {
        props.component.setSetting("measures", selectedMeasures.value);
    },
    { deep: true },
);
watch(
    selectedRows,
    () => {
        props.component.setSetting("rows", selectedRows.value);
    },
    { deep: true },
);
watch(
    selectedCols,
    () => {
        props.component.setSetting("cols", selectedCols.value);
    },
    { deep: true },
);

onMounted(() => {
    getStores();
});
</script>

<template>
    <div class="mt-4 mb-4">
        <va-collapse v-model="storeSelectionOpened" header="Request settings">
            <div class="settings-container">
                <va-divider class="pad_bottom" orientation="left">
                    <span class="px-2">{{ t("Widgets.selectStore") }}</span>
                </va-divider>
                <div class="store_list">
                    <div
                        v-for="store in stores"
                        :key="store.id"
                        class="store_list-item"
                    >
                        <va-radio
                            :model-value="storeId"
                            @update:model-value="updateStore"
                            :option="{
                                text: `${store.caption} ${store.id}`,
                                id: store.id,
                            }"
                            value-by="id"
                            name="store-radio-group"
                        />
                        <div
                            class="store_list-item-query_designer"
                            v-if="store.id === storeId"
                        >
                            <div>
                                <div class="query_designer-area-header">
                                    <div>Filters</div>
                                    <VaButton
                                        icon="add"
                                        preset="secondary"
                                        round
                                        disabled
                                    />
                                </div>
                                <div class="query_designer-area"></div>
                            </div>
                            <div>
                                <div class="query_designer-area-header">
                                    <div>Rows</div>
                                    <VaButton
                                        icon="add"
                                        preset="secondary"
                                        round
                                        @click="
                                            openAxisSelectionModal(
                                                'rows',
                                                store,
                                            )
                                        "
                                    />
                                </div>
                                <div class="query_designer-area">
                                    <div
                                        v-for="item in selectedRows"
                                        :key="item.HIERARCHY_UNIQUE_NAME"
                                        class="query_designer-area-item"
                                    >
                                        <div>
                                            {{ item.HIERARCHY_NAME }}
                                        </div>
                                        <VaButton
                                            icon="remove"
                                            preset="secondary"
                                            round
                                            @click="
                                                removeFromAxis(
                                                    'rows',
                                                    item.HIERARCHY_UNIQUE_NAME,
                                                )
                                            "
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="query_designer-area-header">
                                    <div>Columns</div>
                                    <VaButton
                                        icon="add"
                                        preset="secondary"
                                        round
                                        @click="
                                            openAxisSelectionModal(
                                                'cols',
                                                store,
                                            )
                                        "
                                    />
                                </div>
                                <div class="query_designer-area">
                                    <div
                                        v-for="item in selectedCols"
                                        :key="item.HIERARCHY_UNIQUE_NAME"
                                        class="query_designer-area-item"
                                    >
                                        <div>
                                            {{ item.HIERARCHY_NAME }}
                                        </div>
                                        <VaButton
                                            icon="remove"
                                            preset="secondary"
                                            round
                                            @click="
                                                removeFromAxis(
                                                    'cols',
                                                    item.HIERARCHY_UNIQUE_NAME,
                                                )
                                            "
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="query_designer-area-header">
                                    <div>Measures</div>
                                    <VaButton
                                        icon="add"
                                        preset="secondary"
                                        round
                                        @click="
                                            openMeasureSelectionModal(store)
                                        "
                                    />
                                </div>
                                <div class="query_designer-area">
                                    <div
                                        v-for="measure in selectedMeasures"
                                        :key="measure.MEASURE_UNIQUE_NAME"
                                        class="query_designer-area-item"
                                    >
                                        <div>
                                            {{ measure.MEASURE_NAME }}
                                        </div>
                                        <VaButton
                                            icon="remove"
                                            preset="secondary"
                                            round
                                            @click="
                                                removeMeasure(
                                                    measure.MEASURE_UNIQUE_NAME,
                                                )
                                            "
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Teleport to="body">
                        <MeasureSelectionModal ref="measureSelectionModal" />
                        <AxisSelectionModal ref="axisSelectionModal" />
                    </Teleport>
                </div>
            </div>
        </va-collapse>
    </div>
</template>
<style>
.store_list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: auto;
    min-height: 400px;
    max-height: 600px;
    padding: 0.5rem;
    border: 1px solid lightgrey;
    border-radius: 0.5rem;
}

.store_list-item {
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 0.25rem;
}

.store_list-item-query_designer {
    border-top: 1px solid lightgrey;
    margin: 0.25rem -0.25rem 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0.5rem;
    gap: 0.5rem;
}

.query_designer-area {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 1px dashed lightgrey;
    height: 200px;
    padding: 0.5rem;
    overflow: auto;
}

.query_designer-area-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 0.25rem;
    padding-left: 0.5rem;
}

.query_designer-area-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: 0.5rem;
}
</style>
