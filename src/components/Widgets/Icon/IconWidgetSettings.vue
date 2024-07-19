<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { ref, onMounted, computed, type Ref, provide } from "vue";
import type { CollapseState, MaterialIcon } from "@/@types/widgets";
import type { Store } from "@/stores/Widgets/Store";
import type { XMLAStore } from "@/stores/Widgets/XMLAStore";
import MaterialIcons from "@/assets/icons/MaterialIcons.json";
import { useI18n } from "vue-i18n";

export interface IIconSettings {
    currentIcon: string;
    iconColor: string;
    iconSize: number;
    isIconFilled: boolean;
    strokeWeight: number;
    opticSize: number;
    grade: number;
}

export interface IIconComponent {
    store: Store | XMLAStore;
    settings: IIconSettings;
    setSetting: (key: string, value: any) => void;
    setStore: (store: Store | XMLAStore) => void;
}

const { t } = useI18n();
const { component } = defineProps<{ component: IIconComponent }>();
const isDarkTheme: Ref<boolean> = ref(
    JSON.parse(localStorage.getItem("isDarkTheme")) || false,
);

const opened: Ref<CollapseState> = ref({
    widgetSection: false,
    storeSection: false,
});

const iconsList: Ref<MaterialIcon[]> = ref([]);
const searchQuery: Ref<string> = ref("");

function filterUniqueIcons(icons: MaterialIcon[]) {
    const uniqueNames: Set<string> = new Set();
    return icons.filter((icon: MaterialIcon) => {
        if (!uniqueNames.has(icon.name)) {
            uniqueNames.add(icon.name);
            return true;
        }
        return false;
    });
}

const filteredIcons = computed(() => {
    return iconsList.value.filter((icon: MaterialIcon) =>
        icon.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
});

const handleIconClick = (icon: MaterialIcon) => {
    if (icon) component.settings.currentIcon = icon.name;
    component.setSetting("currentIcon", icon.name);
};

onMounted(() => {
    iconsList.value = filterUniqueIcons(MaterialIcons);
});

const fontColor = computed(() => {
    return isDarkTheme.value ? "#ffffff" : "";
});
</script>

<template>
    <va-collapse v-model="opened.widgetSection" :header="t('IconWidget.title')">
        <div class="settings-container">
            <va-input
                v-model="searchQuery"
                placeholder="Search icon..."
                :label="t('IconWidget.iconSearch')"
            />
            <div
                class="icons-container"
                style="
                    font-variation-settings:
                        &quot;FILL&quot; 0,
                        &quot;wght&quot; 200,
                        &quot;GRAD&quot; 100,
                        &quot;opsz&quot; 48;
                "
            >
                <span
                    v-for="icon in filteredIcons"
                    :key="icon.name + icon.version"
                    @click="handleIconClick(icon)"
                    :class="{
                        'active-icon':
                            icon.name === component.settings.currentIcon,
                    }"
                    class="material-symbols-outlined"
                >
                    {{ icon.name }}
                </span>
            </div>
            <va-checkbox
                v-model="component.settings.isIconFilled"
                :label="t('IconWidget.iconFilled')"
                @update:model-value="
                    component.setSetting('isIconFilled', $event)
                "
            />
            <va-color-input
                v-model="component.settings.iconColor"
                :label="t('IconWidget.iconColor')"
                @update:model-value="component.setSetting('iconColor', $event)"
            />
            <va-input
                v-model="component.settings.iconSize"
                :label="t('IconWidget.iconSize')"
                @update:model-value="component.setSetting('iconSize', $event)"
            />
            <va-slider
                class="slider"
                :label-color="fontColor"
                :model-value="component.settings.strokeWeight"
                track-label-visible
                :min="100"
                :max="700"
                :step="100"
                :label="t('IconWidget.strokeWeight')"
                @update:model-value="
                    component.setSetting('strokeWeight', $event)
                "
            />
            <va-slider
                class="slider"
                :label-color="fontColor"
                :model-value="component.settings.opticSize"
                track-label-visible
                :min="20"
                :max="48"
                :label="t('IconWidget.opticSize')"
                @update:model-value="component.setSetting('opticSize', $event)"
            />
            <va-slider
                class="slider"
                :label-color="fontColor"
                :model-value="component.settings.grade"
                track-label-visible
                :min="-25"
                :max="200"
                :step="15"
                :label="t('IconWidget.grade')"
                @update:model-value="component.setSetting('grade', $event)"
            />
        </div>
    </va-collapse>
    <!-- <va-collapse
    v-model="opened.storeSection"
    header="Store settings"
  >
    <div class="settings-container">
      <div>
        <h3 class="mb-2">Select store</h3>
      </div>
    </div>
  </va-collapse> -->
</template>
<style lang="scss" scoped>
.settings-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
}

.icons-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    max-height: 220px;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    cursor: pointer;
    padding: 10px;
}

.material-symbols-outlined {
    font-family: "Material Symbols Outlined";
    font-weight: normal;
    font-style: inherit;
    font-size: 40px;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    border: 2px solid transparent;
    border-radius: 5px;
    transition:
        border-color 0.5s ease,
        transform 0.5s ease;

    &:hover {
        transform: scale(1.1);
    }
}

.active-icon {
    border: 2px solid rgb(0, 121, 0);
}

.slider {
    padding: 0 10px;
}
</style>
