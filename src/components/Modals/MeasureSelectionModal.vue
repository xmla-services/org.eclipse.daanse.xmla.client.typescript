<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts">
import { usePromisifiedModal } from "@/composables/promisifiedModal";
import type { XMLAStore } from "@/stores/Widgets/XMLAStore";
import { ref } from "vue";

export default {
    name: "MeasureSelectionModal",
    setup() {
        const measuresList = ref([] as MDSchemaMeasure[]);
        const selectedMeasures = ref([] as MDSchemaMeasure[]);

        const opened = async (data) => {
            const store = data.store as XMLAStore;
            const preselectedMeasures =
                data.selectedMeasures as MDSchemaMeasure[];
            console.log(store);
            const dataSource = store.getDatasource();

            const measures = await dataSource.getMeasures();
            selectedMeasures.value = preselectedMeasures;

            measuresList.value = measures;
        };

        const { isOpened, run, close } = usePromisifiedModal(() => {
            selectedMeasures.value = [];
            measuresList.value = [];
        }, opened);

        return {
            isOpened,
            run,
            close,
            measuresList,
            selectedMeasures,
        };
    },
    methods: {
        ok() {
            this.close(this.selectedMeasures);
        },
    },
};
</script>
<template>
    <va-modal
        :modelValue="isOpened"
        no-padding
        class="modal"
        @ok="ok"
        zIndex="10000000"
    >
        <template #content="{ ok }">
            <va-card-title class="va-h6">Select measures</va-card-title>
            <va-card-content>
                <VaOptionList
                    v-model="selectedMeasures"
                    :options="measuresList"
                    track-by="MEASURE_UNIQUE_NAME"
                    text-by="MEASURE_NAME"
                    class="measure_list"
                />
            </va-card-content>
            <va-card-actions>
                <va-button @click="ok">Ok!</va-button>
            </va-card-actions>
        </template>
    </va-modal>
</template>
<style lang="scss" scoped>
.measure_list {
    padding: 20px 0;
}

.modal {
    z-index: 1000000;
}
</style>
