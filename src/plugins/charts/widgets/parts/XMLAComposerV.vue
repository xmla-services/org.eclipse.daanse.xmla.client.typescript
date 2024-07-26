<script setup lang="ts">
import { ref, type Ref, watch, computed } from "vue";
import MeasureSelectionModal from "@/components/Modals/MeasureSelectionModal.vue";
import AxisSelectionModal from "@/components/Modals/AxisSelectionModal.vue";
import FilterSelectionModal from "@/components/Modals/FilterSelectionModal.vue";
import type { AxisSettings } from "@/plugins/charts/widgets/BarChartWidgetSettings.vue";
import type { IChartComponent } from "chart.js/dist/core/core.typedRegistry";
import type { XMLAComposer } from "../../impl/XMLAComposer";

const measureSelectionModal = ref() as Ref<any>;
const axisSelectionModal = ref() as Ref<any>;
const filterSelectionModal = ref() as Ref<typeof FilterSelectionModal>;

const model = defineModel() as any;

console.log(model.value);
const store = ref(model.value.getStore());

const props = defineProps<{
    axes: { [key: string]: AxisSettings };
    component: IChartComponent;
}>();

// const selectedMeasures = ref([] as MDSchemaMeasure[]);
// const selectedRows = ref([] as ConfiguredHierarchy[]);
// const selectedCols = ref([] as ConfiguredHierarchy[]);
// const selectedFilters = ref([] as ConfiguredHierarchy[]);

const openAxisSelectionModal = async (axis) => {
    let currentSelection = null;

    switch (axis) {
        case "rows":
            currentSelection = model.value.selectedRows;
            break;
        case "cols":
            currentSelection = model.value.selectedCols;
            break;
        case "filters":
            currentSelection = model.value.selectedFilters;
            break;
    }

    const selectedHierarchies = await axisSelectionModal.value.run({
        store: store.value,
        selectedHierarchies: currentSelection,
    });

    if (axis === "rows") {
        model.value.selectedRows = selectedHierarchies;
    } else if (axis === "cols") {
        model.value.selectedCols = selectedHierarchies;
    } else if (axis === "filters") {
        model.value.selectedFilters = selectedHierarchies;
    }
};

const openFiltersModal = async (axis, id) => {
    if (axis === "rows") {
        const selectedHierarchy = model.value.selectedRows.find(
            (hierarchy) => hierarchy.id === id,
        );

        const filtersCongig = await filterSelectionModal.value.run({
            store: store.value,
            element: selectedHierarchy,
        });

        if (selectedHierarchy) {
            selectedHierarchy.filters.enabled = filtersCongig.filters.enabled;
            selectedHierarchy.filters.multipleChoise =
                filtersCongig.filters.multipleChoise;
            selectedHierarchy.filters.selectedItem =
                filtersCongig.filters.selectedItem;
            selectedHierarchy.filters.originalItem =
                filtersCongig.filters.originalItem;
        }
    } else if (axis === "cols") {
        const selectedHierarchy = model.value.selectedCols.find(
            (hierarchy) => hierarchy.id === id,
        );

        const filtersCongig = await filterSelectionModal.value.run({
            store: store.value,
            element: selectedHierarchy,
        });

        if (selectedHierarchy) {
            selectedHierarchy.filters.enabled = filtersCongig.filters.enabled;
            selectedHierarchy.filters.multipleChoise =
                filtersCongig.filters.multipleChoise;
            selectedHierarchy.filters.selectedItem =
                filtersCongig.filters.selectedItem;
            selectedHierarchy.filters.originalItem =
                filtersCongig.filters.originalItem;
        }
    } else if (axis === "filters") {
        const selectedHierarchy = model.value.selectedFilters.find(
            (hierarchy) => hierarchy.id === id,
        );

        const filtersCongig = await filterSelectionModal.value.run({
            store: store.value,
            element: selectedHierarchy,
        });

        if (selectedHierarchy) {
            selectedHierarchy.filters.enabled = filtersCongig.filters.enabled;
            selectedHierarchy.filters.multipleChoise =
                filtersCongig.filters.multipleChoise;
            selectedHierarchy.filters.selectedItem =
                filtersCongig.filters.selectedItem;
            selectedHierarchy.filters.originalItem =
                filtersCongig.filters.originalItem;
        }
    }
};

const removeFromAxis = (axis, hierarchyUniqueName) => {
    if (axis === "rows") {
        model.value.selectedRows = model.value.selectedRows.filter(
            (hierarchy) =>
                hierarchy.originalItem.HIERARCHY_UNIQUE_NAME !==
                hierarchyUniqueName,
        );
    } else if (axis === "cols") {
        model.value.selectedCols = model.value.selectedCols.filter(
            (hierarchy) =>
                hierarchy.originalItem.HIERARCHY_UNIQUE_NAME !==
                hierarchyUniqueName,
        );
    } else if (axis === "filters") {
        model.value.selectedFilters = model.value.selectedFilters.filter(
            (hierarchy) =>
                hierarchy.originalItem.HIERARCHY_UNIQUE_NAME !==
                hierarchyUniqueName,
        );
    }
};

const openMeasureSelectionModal = async () => {
    model.value.selectedMeasures = await measureSelectionModal.value.run({
        store: store.value,
        selectedMeasures: model.value.selectedMeasures,
    });
};
const removeMeasure = (measureUniqueName) => {
    model.value.selectedMeasures = model.value.selectedMeasures.filter(
        (measure) => measure.MEASURE_UNIQUE_NAME !== measureUniqueName,
    );
};

const headers = computed(() => {
    return Object.keys(model.value.data).map((key) => ({
        header: key,
        id: key,
    }));
});

watch(
    () => [
        model.value.selectedRows,
        model.value.selectedCols,
        model.value.selectedMeasures,
    ],
    async () => {
        model.value.data = await model.value.getData();
    },
    { deep: true },
);

const axis_names = computed((e) => {
    return Object.keys(props.axes).filter((name) => name != "x");
});

const xSel = computed({
    get: () => {
        return model.value?.getSelectorX();
    },
    set: (val) => {
        model.value?.setSelectorX(val);
    },
});

const updateSelectorY = (value, axisName) => {
    const selection = value.map((e) => headers.value.find((h) => h.id === e));
    model.value?.setSelectorsY(selection, axisName);
    // model.value?.setSelectorY(selector, value, axisName);
};

const getAxisSelection = (axisName) => {
    return model.value?.getSelectorY(axisName).map((e) => e.id);
};
</script>

<template>
    <div class="composer">
        <div class="store_list-item-query_designer">
            <div>
                <div class="query_designer-area-header">
                    <div>Filters</div>
                    <VaButton
                        icon="add"
                        preset="secondary"
                        round
                        @click="openAxisSelectionModal('filters')"
                    />
                </div>
                <div class="query_designer-area">
                    <div
                        v-for="item in model.selectedFilters"
                        :key="item.id"
                        class="query_designer-area-item"
                    >
                        <div>
                            {{ item.caption }}
                        </div>
                        <VaButton
                            icon="filter_list"
                            preset="secondary"
                            round
                            :color="item.filters.enabled ? '#4CAF50' : ''"
                            @click="openFiltersModal(store, 'filters')"
                        />
                        <VaButton
                            icon="remove"
                            preset="secondary"
                            round
                            @click="removeFromAxis('filters', item.id)"
                        />
                    </div>
                </div>
            </div>
            <div>
                <div class="query_designer-area-header">
                    <div>Rows</div>
                    <VaButton
                        icon="add"
                        preset="secondary"
                        round
                        @click="openAxisSelectionModal('rows')"
                    />
                </div>
                <div class="query_designer-area">
                    <div
                        v-for="item in model.selectedRows"
                        :key="item.id"
                        class="query_designer-area-item"
                    >
                        <div>
                            {{ item.caption }}
                        </div>
                        <VaButton
                            icon="filter_list"
                            preset="secondary"
                            round
                            :color="item.filters.enabled ? '#4CAF50' : ''"
                            @click="openFiltersModal('rows', item.id)"
                        />
                        <VaButton
                            icon="remove"
                            preset="secondary"
                            round
                            @click="removeFromAxis('rows', item.id)"
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
                        @click="openAxisSelectionModal('cols')"
                    />
                </div>
                <div class="query_designer-area">
                    <div
                        v-for="item in model.selectedCols"
                        :key="item.id"
                        class="query_designer-area-item"
                    >
                        <div>
                            {{ item.caption }}
                        </div>
                        <VaButton
                            icon="filter_list"
                            preset="secondary"
                            round
                            :color="item.filters.enabled ? '#4CAF50' : ''"
                            @click="openFiltersModal('cols', item.id)"
                        />
                        <VaButton
                            icon="remove"
                            preset="secondary"
                            round
                            @click="removeFromAxis('cols', item.id)"
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
                        @click="openMeasureSelectionModal()"
                    />
                </div>
                <div class="query_designer-area">
                    <div
                        v-for="measure in model.selectedMeasures"
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
                            @click="removeMeasure(measure.MEASURE_UNIQUE_NAME)"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div>
                <div>xAxis:</div>
                <div>
                    <VaSelect
                        v-model="xSel"
                        :options="headers"
                        text-by="header"
                        placeholder="Select an header for X"
                    />
                </div>
            </div>
            <div>
                <div>yAxis:</div>
                <div v-for="name in axis_names" :key="name">
                    <div>{{ name }}</div>
                    <VaSelect
                        :model-value="getAxisSelection(name)"
                        @update:model-value="
                            (event) => updateSelectorY(event, name)
                        "
                        :options="headers"
                        text-by="header"
                        value-by="id"
                        multiple
                        placeholder="Select an header for Y"
                    />
                </div>
            </div>
        </div>
        <Teleport to="body">
            <MeasureSelectionModal ref="measureSelectionModal" />
            <AxisSelectionModal ref="axisSelectionModal" />
            <FilterSelectionModal ref="filterSelectionModal" />
        </Teleport>
    </div>
</template>

<style scoped lang="scss"></style>
