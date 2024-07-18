<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts">
import { usePromisifiedModal } from "@/composables/promisifiedModal";
import { ref } from "vue";
import FilterView from "../Filters/FilterView.vue";
import { useI18n } from "vue-i18n";
import type XMLADatasource from "@/dataSources/XmlaDatasource";

export default {
    name: "FilterSelectionModal",
    setup() {
        const { t } = useI18n();
        const filterConfigured = ref({});
        const rootHierarchy = ref({});
        const reset = () => {
            filterConfigured.value = {};
        };
        const multipleChoise = ref(false);
        const currentlySelected = ref(null as any);
        const datasource = ref(null as any);

        const opened = ({ element, store }) => {
            datasource.value = store.getDatasource() as XMLADatasource;
            rootHierarchy.value = {
                item: element.originalItem,
                filters: element.filters,
            };

            const initialFilters = element.filters;
            multipleChoise.value = initialFilters.multipleChoise;

            if (initialFilters.multipleChoise) {
                filterConfigured.value = {
                    enabled: initialFilters.enabled,
                    multipleChoise: initialFilters.multipleChoise,
                    selectAll: initialFilters.selectAll,
                    selectedItems: initialFilters.selectedItems,
                    deselectedItems: initialFilters.deselectedItems,
                    originalItem: initialFilters.originalItem,
                };
            } else {
                filterConfigured.value = {
                    enabled: initialFilters.enabled,
                    multipleChoise: initialFilters.multipleChoise,
                    selectedItem: initialFilters.selectedItem,
                    originalItem: initialFilters.originalItem,
                };

                currentlySelected.value = initialFilters.selectedItem;
            }
        };
        const { isOpened, run, close } = usePromisifiedModal(reset, opened);

        const setSelection = ({
            enabled,
            multipleChoise,
            selectedItem,
            selectAll,
            selectedItems,
            deselectedItems,
            originalItem,
        }: {
            enabled: boolean;
            multipleChoise: boolean;
            selectAll: boolean;
            selectedItem: any;
            selectedItems: any[];
            deselectedItems: any[];
            originalItem: any;
        }) => {
            if (multipleChoise) {
                filterConfigured.value = {
                    enabled,
                    multipleChoise,
                    selectAll,
                    selectedItems,
                    deselectedItems,
                    originalItem,
                };
            } else {
                filterConfigured.value = {
                    enabled,
                    multipleChoise,
                    selectedItem,
                    originalItem,
                };

                currentlySelected.value = selectedItem;
            }
        };

        return {
            t,
            filterConfigured,
            isOpened,
            run,
            close,
            rootHierarchy,
            setSelection,
            multipleChoise,
            currentlySelected,
            datasource,
        };
    },
    methods: {
        ok() {
            this.close({ filters: this.filterConfigured });
        },
        cancel() {
            this.close({});
        },
        resetSelection() {
            this.$refs.filterTreeView?.resetSelection();
        },
    },
    components: { FilterView },
};
</script>
<template>
    <va-modal
        :modelValue="isOpened"
        no-padding
        class="filter-modal"
        @ok="ok"
        fixed-layout
        zIndex="10000000"
    >
        <template #content="{ ok }">
            <va-card-title class="va-h6">{{
                t("FilterModal.enableFilters")
            }}</va-card-title>
            <va-card-content>
                <Suspense>
                    <FilterView
                        ref="filterTreeView"
                        :datasource="datasource"
                        :rootHierarchy="rootHierarchy"
                        @set-selection="setSelection"
                    ></FilterView>
                </Suspense>
            </va-card-content>
            <va-card-actions class="actions">
                <div class="action-buttons">
                    <va-button @click="ok" color="primary">{{
                        t("Modals.confirmButton")
                    }}</va-button>
                    <va-button @click="cancel" color="secondary">{{
                        t("Modals.cancelButton")
                    }}</va-button>
                </div>
                <div
                    v-if="
                        !multipleChoise &&
                        currentlySelected &&
                        currentlySelected.id
                    "
                >
                    <div>
                        {{ t("FilterModal.currentlySelection") }}
                        {{ currentlySelected.Caption }}
                    </div>
                    <div class="reset-button" @click="resetSelection">
                        {{ t("FilterModal.resetSelection") }}
                    </div>
                </div>
            </va-card-actions>
        </template>
    </va-modal>
</template>
<style lang="scss">
.filter-modal {
    .va-modal--fixed-layout .va-modal__inner {
        height: calc(100vh - 2rem);
    }

    .va-modal__container {
        width: 100%;
    }

    .va-modal__dialog {
        margin: auto;
    }

    .va-modal__inner > div {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .va-card__content {
        overflow: hidden;
        display: flex;
        width: 100%;
        height: 100%;
    }

    .va-card__content > div {
        flex-direction: column;
        overflow: hidden;
        width: 100%;
    }

    .actions {
        display: flex;
        justify-content: space-between !important;
    }

    .reset-button {
        margin-top: 0.25rem;
        color: var(--va-primary);
        text-decoration: underline;
        user-select: none;
        cursor: pointer;
    }
}
</style>
