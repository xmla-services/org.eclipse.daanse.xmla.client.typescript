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
import StoreList from "@/components/Stores/StoreList.vue";
import { useStoreManager } from "@/composables/storeManager";
import { computed, inject, ref } from "vue";

const { t } = useI18n();
const EventBus = inject("customEventBus") as any;
const storeManager = useStoreManager();

const isDropdownVisible = ref(false);

const storeList = computed(() => {
    console.log(storeManager.getStoreTypes());
    return {};
});

const addSelectedStore = (store: string) => {
    storeManager.initStore(t("SidebarStoreList.newStore"), EventBus, store);
};
</script>

<template>
    <div class="sidebar-stores">
        <div class="sidebar-stores-title">
            <h2 class="mb-2">{{ t("SidebarStoreSettings.storesTitle") }}</h2>

            <va-dropdown
                placement="bottom-end"
                @close="isDropdownVisible = false"
                @open="isDropdownVisible = true"
            >
                <template #anchor>
                    <va-button
                        class="dropdown-button"
                        icon="add"
                        v-model="isDropdownVisible"
                    >
                        {{ t("SidebarStoreSettings.addNewStore") }}
                    </va-button>
                </template>
                <va-dropdown-content class="dropdown-list">
                    <div
                        class="dropdown-item"
                        v-for="store of storeManager.getStoreTypes()"
                        :key="store"
                        @click="addSelectedStore(store)"
                    >
                        <div>
                            {{ store }}
                        </div>
                    </div>
                </va-dropdown-content>
            </va-dropdown>
        </div>
        <StoreList class="mt-2" />
    </div>
</template>

<style lang="css">
.dropdown-list {
    padding: 0;
}

.dropdown-item {
    padding: 1rem 1.5rem;
    cursor: pointer;
    min-width: 100px;
}

.dropdown-item:hover {
    background-color: #f0f0f0;
}

.settings-sidebar {
    background-color: white;
    height: 100%;
    width: 100%;
}

.sidebar-stores {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 10px;
    width: 100%;
}

.sidebar-stores-title {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.sidebar-stores-title > h2 {
    font-size: 24px;
    flex-grow: 1;
}
</style>
