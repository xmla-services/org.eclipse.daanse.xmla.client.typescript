<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import PivotTableWidgetSettings from "./PivotTableWidgetSettings.vue";
import { provide, ref, watch, type Ref, computed, inject } from "vue";
import { TinyEmitter } from "tiny-emitter";
import { useElementSize } from "@vueuse/core";
import PivotTable from "./PivotTable";
import RowsArea from "../../PivotTable/Areas/RowsArea.vue";
import ColumnsArea from "../../PivotTable/Areas/ColumnsArea.vue";
import CellsArea from "../../PivotTable/Areas/CellsArea.vue";
import PivotTableSettingsButton from "@/components/PivotTable/PivotTableSettingsButton.vue";
import { type XMLAStore } from "@/stores/Widgets/XMLAStore";
import { useStore } from "@/composables/widgets/store";
import { useDrilldowns } from "@/composables/mdx/drilldowns";
import {
    parseMdxRequest,
    parseRequestToTable,
} from "@/utils/MdxRequests/MdxRequestHelper";
import { debounce } from "lodash";

const DEFAULT_COLUMN_WIDTH = 150;
const DEFAULT_ROW_HEIGHT = 30;
const DEFAULT_ROW_HEIGHT_CSS = `${DEFAULT_ROW_HEIGHT}px`;
const inited = ref(false);
const settingsComponent = PivotTableWidgetSettings;

const EventBus = inject("customEventBus") as any;

const rowsHierarchies = ref([] as MDSchemaHierarchy[]);
const colsHierarchies = ref([] as MDSchemaHierarchy[]);
const measures = ref([] as MDSchemaMeasure[]);
const filters = ref([] as MDSchemaHierarchy[]);
const pivotTableControl = new PivotTable();

const rows = ref([] as any[]);
const columns = ref([] as any[]);
const cells = ref([] as any[]);
const propertiesRows = ref([] as any[]);
const propertiesCols = ref([] as any[]);

const colStyles = ref([...pivotTableControl.styles.columns]);
const rowsStyles = ref([...pivotTableControl.styles.rows]);

const settings = ref({
    sync: false,
});

const updateFn = debounce(async (store) => {
    inited.value = true;

    flushExpands(colsHierarchies.value, rowsHierarchies.value);
    flushDrilldowns(colsHierarchies.value, rowsHierarchies.value);

    const requestParams = {
        rows: rowsHierarchies.value,
        columns: colsHierarchies.value,
        measures: measures.value,
        rowsExpandedMembers: rowsExpandedMembers.value,
        rowsDrilldownMembers: rowsDrilldownMembers.value,
        columnsExpandedMembers: columnsExpandedMembers.value,
        columnsDrilldownMembers: columnsDrilldownMembers.value,
    };

    console.log(store);
    const mdxResponce = await store.getData(requestParams);
    console.log(mdxResponce);

    const {
        cells: cellsResponce,
        rows: rowsResponce,
        columns: columnsResponce,
        propertiesRows: propertiesRowsResponce,
        propertiesCols: propertiesColsResponce,
    } = parseMdxRequest(mdxResponce);

    parseRequestToTable(mdxResponce, 0);

    rows.value = rowsResponce;
    columns.value = columnsResponce;
    cells.value = cellsResponce;
    propertiesRows.value = propertiesRowsResponce;
    propertiesCols.value = propertiesColsResponce;
}, 100);

const watcher = (oldVal, newVal) => {
    if (settings.value.sync) {
        EventBus.off(`DRILLDOWN:${oldVal.id}`, handleDrilldownEvent);
        EventBus.off(`DRILLUP:${oldVal.id}`, handleDrillupEvent);
        EventBus.off(`EXPAND:${oldVal.id}`, handleExpandEvent);
        EventBus.off(`COLLAPSE:${oldVal.id}`, handleCollapseEvent);

        EventBus.on(`DRILLDOWN:${newVal.id}`, handleDrilldownEvent);
        EventBus.on(`DRILLUP:${newVal.id}`, handleDrillupEvent);
        EventBus.on(`EXPAND:${newVal.id}`, handleExpandEvent);
        EventBus.on(`COLLAPSE:${newVal.id}`, handleCollapseEvent);
    }
};

const { store, setStore } = useStore<XMLAStore>(updateFn, watcher);

const {
    rowsExpandedMembers,
    rowsDrilldownMembers,
    columnsExpandedMembers,
    columnsDrilldownMembers,
    drilldownOnRows,
    drilldownOnColumns,
    drillupOnRows,
    drillupOnColumns,
    expandOnRows,
    collapseOnRows,
    expandOnColumns,
    collapseOnColumns,
    flushExpands,
    flushDrilldowns,
    handleDrilldownEvent,
    handleDrillupEvent,
    handleExpandEvent,
    handleCollapseEvent,
} = useDrilldowns(store);

const setSetting = (setting: string, data: any) => {
    if (setting === "rowsHierarchies") {
        rowsHierarchies.value = data;
    } else if (setting === "colsHierarchies") {
        colsHierarchies.value = data;
    } else if (setting === "measures") {
        measures.value = data;
    } else if (setting === "filters") {
        filters.value = data;
    } else if (setting === "sync") {
        if (data) {
            EventBus.on(`DRILLDOWN:${store.value.id}`, handleDrilldownEvent);
            EventBus.on(`DRILLUP:${store.value.id}`, handleDrillupEvent);
            EventBus.on(`EXPAND:${store.value.id}`, handleExpandEvent);
            EventBus.on(`COLLAPSE:${store.value.id}`, handleCollapseEvent);
        } else {
            EventBus.off(`DRILLDOWN:${store.value.id}`, handleDrilldownEvent);
            EventBus.off(`DRILLUP:${store.value.id}`, handleDrillupEvent);
            EventBus.off(`EXPAND:${store.value.id}`, handleExpandEvent);
            EventBus.off(`COLLAPSE:${store.value.id}`, handleCollapseEvent);
        }
        settings.value.sync = data;
    } else if (setting === "rowsExpandedMembers") {
        rowsExpandedMembers.value = data;
    } else if (setting === "rowsDrilldownMembers") {
        rowsDrilldownMembers.value = data;
    } else if (setting === "columnsExpandedMembers") {
        columnsExpandedMembers.value = data;
    } else if (setting === "columnsDrilldownMembers") {
        columnsDrilldownMembers.value = data;
    }

    console.log(setting, data);
};

watch(
    () => [
        rowsHierarchies.value,
        colsHierarchies.value,
        measures.value,
        filters.value,
        rowsExpandedMembers.value,
        rowsDrilldownMembers.value,
        columnsExpandedMembers.value,
        columnsDrilldownMembers.value,
    ],
    () => {
        updateFn(store.value);
    },
    { deep: true },
);

const getState = () => {
    return {
        rowsHierarchies: rowsHierarchies.value,
        colsHierarchies: colsHierarchies.value,
        measures: measures.value,
        filters: filters.value,
        rowsStyles: rowsStyles.value,
        colStyles: colStyles.value,
        rowsExpandedMembers: rowsExpandedMembers.value,
        columnsExpandedMembers: columnsExpandedMembers.value,
        rowsDrilldownMembers: rowsDrilldownMembers.value,
        columnsDrilldownMembers: columnsDrilldownMembers.value,
        sync: settings.value.sync,
    };
};

const getQueryState = () => {
    return {
        rowsHierarchies: rowsHierarchies.value,
        colsHierarchies: colsHierarchies.value,
        measures: measures.value,
        filters: filters.value,
    };
};

defineExpose({
    settingsComponent,
    store,
    setSetting,
    settings,
    getState,
    setStore,
    getQueryState,
});

// Pivot table logic

const rowsContainer = ref(null) as Ref<any>;
const { width: rowsWidth } = useElementSize(rowsContainer);

const eventBus = new TinyEmitter();
provide("pivotTableEventBus", eventBus);

const onResize = (e: MouseEvent) => {
    eventBus.emit("onResize", e);
};

const onStopResize = () => {
    eventBus.emit("onStopResize");
};

const drillthrough = () => {
    console.log(drillthrough);
};

const columnsOffset = computed(() => {
    return rows.value?.[0]?.length * DEFAULT_COLUMN_WIDTH;
});

const setRowsStyles = (i: number, value: number) => {
    rowsStyles.value[i] = value;
};

const setColumnsStyles = (i: number, value: number) => {
    colStyles.value[i] = value;
};

provide("setRowsStyles", setRowsStyles);
provide("setColumnsStyles", setColumnsStyles);

provide("drilldown", (value, area) => {
    if (area === "rows") {
        drilldownOnRows(value);
    } else if (area === "columns") {
        drilldownOnColumns(value);
    }

    if (settings.value.sync) {
        EventBus.emit(`DRILLDOWN:${store.value.id}`, { value, area });
    }
});
provide("drillup", (value, area) => {
    if (area === "rows") {
        drillupOnRows(value);
    } else if (area === "columns") {
        drillupOnColumns(value);
    }

    if (settings.value.sync) {
        EventBus.emit(`DRILLUP:${store.value.id}`, { value, area });
    }
});
provide("expand", (value, area) => {
    if (area === "rows") {
        expandOnRows(value);
    } else if (area === "columns") {
        expandOnColumns(value);
    }

    if (settings.value.sync) {
        EventBus.emit(`EXPAND:${store.value.id}`, { value, area });
    }
});
provide("collapse", (value, area) => {
    if (area === "rows") {
        collapseOnRows(value);
    } else if (area === "columns") {
        collapseOnColumns(value);
    }

    if (settings.value.sync) {
        EventBus.emit(`COLLAPSE:${store.value.id}`, { value, area });
    }
});

const totalContentSize = computed(() => {
    const columnsDesc = [
        ...propertiesCols.value,
        ...(columns.value.length ? columns.value : [{}]),
    ];
    const xAxisDesc = columnsDesc.reduce(
        (
            acc: {
                items: any[];
                totalWidth: number;
            },
            _: any,
            i: number,
        ) => {
            acc.items[i] = {
                start: acc.totalWidth,
                width: colStyles.value[i] || DEFAULT_COLUMN_WIDTH,
            };
            acc.totalWidth =
                acc.totalWidth + (colStyles.value[i] || DEFAULT_COLUMN_WIDTH);
            return acc;
        },
        { items: [], totalWidth: 0 },
    );

    const rowsDesc = [
        ...propertiesRows.value,
        ...(rows.value.length ? rows.value : [{}]),
    ];
    const yAxisDesc = rowsDesc.reduce(
        (
            acc: {
                items: any[];
                totalWidth: number;
            },
            _: any,
            i: number,
        ) => {
            acc.items[i] = {
                start: acc.totalWidth,
                width: rowsStyles.value[i] || DEFAULT_ROW_HEIGHT,
            };
            acc.totalWidth =
                acc.totalWidth + (rowsStyles.value[i] || DEFAULT_ROW_HEIGHT);
            return acc;
        },
        { items: [], totalWidth: 0 },
    );

    return {
        xAxis: xAxisDesc,
        yAxis: yAxisDesc,
    };
});
</script>

<template>
    <template v-if="inited">
        <div
            class="pivotTable_container"
            @mousemove="onResize"
            @mouseup="onStopResize"
            @mouseleave="onStopResize"
            @contextmenu.stop.prevent=""
        >
            <div class="placeholder">
                <div class="bar">
                    <!-- <va-button
            v-if="pivotTableStore.state.inited"
            icon="download"
            preset="secondary"
            color="secondary"
            @click="downloadCSV"
          /> -->

                    <PivotTableSettingsButton />
                </div>
            </div>
            <!-- <DrillthroughModal ref="drillthroughModal" /> -->
            <div class="pivotTable">
                <ColumnsArea
                    :columnsStyles="colStyles"
                    :columnsOffset="columnsOffset"
                    :columns="[...propertiesCols, ...columns]"
                    :totalContentSize="totalContentSize"
                    :leftPadding="rowsWidth"
                    :columns-expanded-members="columnsExpandedMembers"
                ></ColumnsArea>
                <div class="d-flex flex-row overflow-hidden vertical-scroll">
                    <RowsArea
                        ref="rowsContainer"
                        :rows="[...propertiesRows, ...rows]"
                        :rowsStyles="rowsStyles"
                        :totalContentSize="totalContentSize"
                        :rows-expanded-members="rowsExpandedMembers"
                    ></RowsArea>
                    <CellsArea
                        :rowsStyles="rowsStyles"
                        :colsStyles="colStyles"
                        :totalContentSize="totalContentSize"
                        :cells="cells"
                        @drillthrough="drillthrough"
                    ></CellsArea>
                </div>
            </div>
        </div>
    </template>
</template>

<style lang="scss">
.pivotTable_container {
    padding: v-bind(DEFAULT_ROW_HEIGHT_CSS);
    height: 100%;

    .bar {
        position: absolute;
        margin-top: -29px;
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: flex-end;
    }
    .placeholder {
        height: 8px;
    }
}
.pivotTable {
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.vertical-scroll {
    height: 100%;
}
</style>
