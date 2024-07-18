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
import { ref, onMounted, type Ref } from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";
import type { XMLAStore } from "@/stores/Widgets/XMLAStore";
import type { CollapseState, ObjectFitSetting } from "@/@types/widgets";

export interface IVideoSettings {
    videoSettings: ObjectFitSetting;
    videoUrl: string;
}

export interface IVideoComponent {
    store: Store | XMLAStore;
    settings: IVideoSettings;
    setSetting: (key: string, value: any) => void;
    setStore: (store: Store | XMLAStore) => void;
}

const { t } = useI18n();
const { component } = defineProps<{ component: IVideoComponent }>();

const opened: Ref<CollapseState> = ref({
    widgetSection: false,
    storeSection: false,
});

const storeManager = useStoreManager();
let stores: Ref<any[]> = ref([]) as Ref<any[]>;
const requestResult: Ref<string> = ref("");

const getStores = () => {
    const storeList = storeManager.getStoreList();

    stores.value = Array.from(storeList.value, function (entry) {
        return { ...entry[1] };
    });
};

const getData = async () => {
    const store = component.store as Store;

    const data = await store.getData();
    requestResult.value = JSON.stringify(data, null, 2);
};

const updateStore = (storeId) => {
    const store = storeManager.getStore(storeId) as Store;
    component.setStore(store);
    console.log(component);
    getData();
};

onMounted(() => {
    getStores();
    if (component.store) {
        getData();
    }
});
</script>

<template>
    <va-collapse
        v-model="opened.widgetSection"
        :header="t('VideoWidget.title')"
    >
        <div class="settings-container">
            <va-input
                :model-value="component.settings.videoUrl"
                :label="t('VideoWidget.videoUrl')"
                @update:model-value="component.setSetting('videoUrl', $event)"
            />
            <va-select
                class="mt-2"
                :model-value="component.settings.videoSettings.fit"
                :label="t('VideoWidget.videoFit')"
                :options="['Cover', 'Contain', 'Stretch', 'Fill', 'None']"
                @update:model-value="component.setSetting('videoSettings.fit', $event)"
            >
            </va-select>
        </div>
    </va-collapse>
    <va-collapse
        v-model="opened.storeSection"
        :header="t('Widgets.storeSettingsTitle')"
    >
        <div class="settings-container">
            <div>
                <h3 class="mb-2">{{ t("Widgets.selectStore") }}</h3>
                <div class="mb-2" v-for="store in stores" :key="store.id">
                    <va-radio
                        :model-value="component.store?.id"
                        @update:model-value="updateStore"
                        :option="{
                            text: `${store.caption} ${store.id}`,
                            id: store.id,
                        }"
                        value-by="id"
                        name="store-radio-group"
                    />
                </div>
                <pre class="response">{{ requestResult }}</pre>
            </div>
        </div>
    </va-collapse>
</template>
<style scoped>
.settings-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
}
</style>
