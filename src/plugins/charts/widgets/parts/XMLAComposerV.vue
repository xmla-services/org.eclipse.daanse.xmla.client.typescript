<script setup lang="ts">
import { ref, type Ref, watch, computed } from "vue";
import MeasureSelectionModal from "@/components/Modals/MeasureSelectionModal.vue";
import AxisSelectionModal from "@/components/Modals/AxisSelectionModal.vue";
import FilterSelectionModal from "@/components/Modals/FilterSelectionModal.vue";
import { parseRequestToTable } from "@/utils/MdxRequests/MdxRequestHelper";
import type { AxisSettings } from "@/plugins/charts/widgets/BarChartWidgetSettings.vue";
import type { IChartComponent } from "chart.js/dist/core/core.typedRegistry";
import type { XMLAComposer } from "../../impl/XMLAComposer";

const measureSelectionModal = ref() as Ref<any>;
const axisSelectionModal = ref() as Ref<any>;
const filterSelectionModal = ref() as Ref<typeof FilterSelectionModal>;

const model = defineModel() as any;

console.log(model.value);
const store = ref(model.value.getStore());
const headers = ref([] as any[]);

const props = defineProps<{
    axes: { [key: string]: AxisSettings };
    component: IChartComponent;
}>();

const selectedMeasures = ref([] as MDSchemaMeasure[]);
const selectedRows = ref([] as ConfiguredHierarchy[]);
const selectedCols = ref([] as ConfiguredHierarchy[]);
const selectedFilters = ref([] as ConfiguredHierarchy[]);

const openAxisSelectionModal = async (axis) => {
    const selectedHierarchies = await axisSelectionModal.value.run({
        store: store.value,
        selectedHierarchies:
            axis === "rows" ? selectedRows.value : selectedCols.value,
    });

    if (axis === "rows") {
        selectedRows.value = selectedHierarchies;
    } else if (axis === "cols") {
        selectedCols.value = selectedHierarchies;
    } else if (axis === "filters") {
        selectedFilters.value = selectedHierarchies;
    }
};

const openFiltersModal = async (axis, id) => {
    if (axis === "rows") {
        const selectedHierarchy = selectedRows.value.find(
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
        const selectedHierarchy = selectedCols.value.find(
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
        const selectedHierarchy = selectedFilters.value.find(
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

    console.log(selectedRows.value);
};

const removeFromAxis = (axis, hierarchyUniqueName) => {
    if (axis === "rows") {
        selectedRows.value = selectedRows.value.filter(
            (hierarchy) =>
                hierarchy.originalItem.HIERARCHY_UNIQUE_NAME !==
                hierarchyUniqueName,
        );
    } else if (axis === "cols") {
        selectedCols.value = selectedCols.value.filter(
            (hierarchy) =>
                hierarchy.originalItem.HIERARCHY_UNIQUE_NAME !==
                hierarchyUniqueName,
        );
    } else if (axis === "filters") {
        selectedFilters.value = selectedFilters.value.filter(
            (hierarchy) =>
                hierarchy.originalItem.HIERARCHY_UNIQUE_NAME !==
                hierarchyUniqueName,
        );
    }
};

const openMeasureSelectionModal = async () => {
    selectedMeasures.value = await measureSelectionModal.value.run({
        store: store.value,
        selectedMeasures: selectedMeasures.value,
    });
};
const removeMeasure = (measureUniqueName) => {
    selectedMeasures.value = selectedMeasures.value.filter(
        (measure) => measure.MEASURE_UNIQUE_NAME !== measureUniqueName,
    );
};

watch(
    () => [selectedRows.value, selectedCols.value, selectedMeasures.value],
    () => {
        getData();
    },
    { deep: true },
);

const getData = async () => {
    const requestParams = {
        rows: selectedRows.value,
        columns: selectedCols.value,
        measures: selectedMeasures.value,
        rowsExpandedMembers: [],
        rowsDrilldownMembers: [],
        columnsExpandedMembers: [],
        columnsDrilldownMembers: [],
    };

    const mdxResponce = await store.value.getData(requestParams);
    const parsedTable = parseRequestToTable(mdxResponce, 0) as any;
    model.value.setData(parsedTable);
    console.log(parsedTable);
    headers.value = Object.keys(parsedTable).map((key) => ({
        header: key,
    }));

    console.log(parseRequestToTable(mdxResponce, 0));
};

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

const ySel = computed(() => {
    return (model.value?.getSelectorsY() as CSVSelector[]).map((e) => e.header);
});

const updateSelectorY = (selector, value) => {
    model.value?.setSelectorY(selector, value);
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
                        v-for="item in selectedFilters"
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
                        v-for="item in selectedRows"
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
                            @click="openFiltersModal(store, 'rows')"
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
                        v-for="item in selectedCols"
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
                            @click="openFiltersModal(store, 'cols')"
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
                    {{ name }}
                    <template v-for="head in headers" :key="head.header">
                        <div>
                            <VaCheckbox
                                :label="head.header"
                                :model-value="ySel.includes(head.header)"
                                @update:model-value="
                                    (event) => updateSelectorY(head, event)
                                "
                            />
                        </div>
                        <!-- :model-value="
                                axisAssignment[name]
                                    ? !!axisAssignment[name].find(
                                          (e) => e.id == head.id,
                                      )
                                    : false
                            "
                            @update:model-value="
                                updateAxisAssignment(
                                    name,
                                    head,
                                    $event,
                                    axisAssignment,
                                )
                            " -->
                    </template>
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
