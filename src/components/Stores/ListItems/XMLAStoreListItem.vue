<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useStoreManager } from "../../../composables/storeManager";
import { useDatasourceManager } from "../../../composables/datasourceManager";
import { onMounted, ref, watch, nextTick, onActivated } from "vue";
import type XMLADatasource from "@/dataSources/XmlaDatasource";

const { t } = useI18n();
const storeManager = useStoreManager();
const dslist = ref([] as XMLADatasource[]);

const catalogs = ref([] as DBSchemaCatalog[]);
const selectedCatalog = ref({} as DBSchemaCatalog);

const cubes = ref([] as MDSchemaCube[]);
const selectedCube = ref({} as MDSchemaCube);
const selectedDatasourceId = ref("");
const selectedDatasource = ref({
    url: "",
    caption: "",
    id: "",
});

watch(
    () => selectedDatasourceId.value,
    (nV) => {
        const currentDs = dslist.value.find((item) => item.id === nV);
        if (!currentDs) {
            return;
        }

        selectedDatasource.value = currentDs;
        const store = storeManager.getStore(item.value.id);
        store.setDatasource(currentDs.id);

        getCatalogs();
    },
    {
        deep: true,
    },
);

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const item = ref(props.item);
const isExpanded = ref(false);

const dsManager = useDatasourceManager();
const dsmap = dsManager.getDatasourceList();

const clickHeader = () => {
    isExpanded.value = !isExpanded.value;
};

watch(
    dsmap,
    () => {
        dslist.value = Object.entries(dsmap.value)
            .map((entry) => {
                return entry[1];
            })
            .filter((e) => e.type === "XMLA") as XMLADatasource[];
    },
    { deep: true },
);

onActivated(() => {
    dslist.value = Object.entries(dsmap.value)
        .map((entry) => {
            return entry[1];
        })
        .filter((e) => e.type === "XMLA") as XMLADatasource[];
});

onMounted(async () => {
    dslist.value = Object.entries(dsmap.value)
        .map((entry) => {
            return entry[1];
        })
        .filter((e) => e.type === "XMLA") as XMLADatasource[];

    const store = storeManager.getStore(item.value.id);
    const ds = store.getDatasource();

    if (ds) {
        selectedDatasourceId.value = ds.id;
    }

    const dsSelected = getSelectedDatasource();
    selectedCatalog.value = dsSelected?.catalog || {
        CATALOG_NAME: "",
        DESCRIPTION: "",
    };
    selectedCube.value = dsSelected?.cube || {
        CUBE_NAME: "",
        CUBE_CAPTION: "",
    };

    await getCatalogs();

    if (selectedCatalog.value.CATALOG_NAME) {
        await getCubes();
    }
    if (selectedCube.value.CUBE_NAME) {
        await getMetadata();
    }
});

const saveStore = (item) => {
    const store = storeManager.getStore(item.id);
    store.setOptions({
        caption: item.caption,
    });
};

const createDatasource = () => {
    const id = dsManager.initDatasource("XMLA", "", "New store");
    selectedDatasourceId.value = id;

    selectedCatalog.value = {
        CATALOG_NAME: "",
        DESCRIPTION: "",
    };
    selectedCube.value = {
        CUBE_NAME: "",
        CUBE_CAPTION: "",
    };
};

const setCaption = () => {
    const ds = dsManager.getDatasource(selectedDatasource.value.id);
    if (ds) {
        dsManager.updateDatasource(
            ds.id,
            ds.type,
            selectedDatasource.value.caption,
            ds.url,
        );
    }
};

const setUrl = () => {
    const ds = dsManager.getDatasource(selectedDatasource.value.id);
    if (ds) {
        dsManager.updateDatasource(
            ds.id,
            ds.type,
            ds.caption,
            selectedDatasource.value.url,
        );

        getCatalogs();
    }
};

const getSelectedDatasource = (): XMLADatasource => {
    const store = storeManager.getStore(item.value.id);
    const selectedDatasource = store.datasourceId;

    return dslist.value.find((e) => {
        return selectedDatasource === e.id;
    }) as XMLADatasource;
};

const getCatalogs = async () => {
    const selectedDatasource = getSelectedDatasource();
    if (!selectedDatasource) {
        return;
    }

    catalogs.value = await selectedDatasource.getCatalogs();
};

const getCubes = async () => {
    const selectedDatasource = getSelectedDatasource();

    if (!selectedDatasource || !selectedCatalog.value) {
        return;
    }

    selectedDatasource.setCatalog(selectedCatalog.value);

    cubes.value = await selectedDatasource.getCubes(
        selectedCatalog.value.CATALOG_NAME,
    );
};

const getMetadata = async () => {
    const selectedDatasource = getSelectedDatasource();

    if (!selectedDatasource || !selectedCube.value) {
        return;
    }

    selectedDatasource.setCube(selectedCube.value);
    await selectedDatasource.openCube(
        selectedCatalog.value.CATALOG_NAME,
        selectedCube.value.CUBE_NAME,
    );
};
</script>

<template>
    <div class="store-item-header" @click="clickHeader">
        <va-list-item-label class="store-item-header-text">
            {{ item.caption }}
            <!-- {{ item.id }} -->
        </va-list-item-label>
        <va-icon v-if="!isExpanded" class="material-icons">
            expand_more
        </va-icon>
        <va-icon v-else class="material-icons"> expand_less </va-icon>
    </div>
    <div v-if="isExpanded" class="store-item-content">
        <va-input
            :label="t('SidebarStoreList.caption')"
            v-model="item.caption"
            @blur="saveStore(item)"
        ></va-input>

        <div class="datasource-list">
            <h2>{{ t("SidebarStoreList.dataSourcesTitle") }}</h2>
            <div class="connections-controls">
                <va-select
                    text-by="caption"
                    value-by="id"
                    v-model="selectedDatasourceId"
                    :options="dslist"
                />
                <va-button
                    class="datasource-list-add-button"
                    @click="createDatasource"
                >
                    {{ t("SidebarStoreList.addDatasourceButton") }}
                </va-button>
            </div>
            <template v-if="selectedDatasource.id">
                <div class="connections-list">
                    <va-input
                        class="mt-3"
                        @blur="setCaption"
                        v-model="selectedDatasource.caption"
                        :label="t('SidebarStoreList.StoreLabels.caption')"
                    ></va-input>
                    <va-input
                        class="mt-3"
                        @blur="setUrl"
                        v-model="selectedDatasource.url"
                        :label="t('SidebarStoreList.StoreLabels.url')"
                    ></va-input>
                </div>
            </template>
            <template v-if="selectedDatasource.id">
                <h2 class="mt-3">
                    {{ t("SidebarStoreList.XMLAStoreListItem.catalog") }}:
                </h2>
                <div class="connections-list">
                    <va-select
                        text-by="CATALOG_NAME"
                        v-model="selectedCatalog"
                        @update:modelValue="getCubes"
                        :options="catalogs"
                    />
                </div>
                <template v-if="Object.keys(selectedCatalog).length">
                    <h2 class="mt-3">
                        {{ t("SidebarStoreList.XMLAStoreListItem.cube") }}:
                    </h2>
                    <div class="connections-list">
                        <va-select
                            text-by="CUBE_NAME"
                            v-model="selectedCube"
                            @update:modelValue="getMetadata"
                            :options="cubes"
                        />
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>
