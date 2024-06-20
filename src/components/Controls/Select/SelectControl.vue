<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
export interface ISelectSettingsProps {
    label?: string;
    options?: string[];
    selectedValue?: string;
    availableEvents?: string[];
    events?: EventItem[];
}

import { inject } from "vue";
import { useSettings } from "@/composables/widgets/settings";
import { useSerialization } from "@/composables/widgets/serialization";
import SelectSettings from "@/components/Controls/Select/SelectSettings.vue";
import type { EventItem } from "@/@types/controls";

const EventBus = inject("customEventBus") as any;
const settingsComponent = SelectSettings;

const props = withDefaults(defineProps<ISelectSettingsProps>(), {
    label: "Test",
    options: (): string[] => ["Test"],
    selectedValue: "",
    availableEvents: (): string[] => ["Click", "Clear", "Scroll Bottom"],
    events: (): EventItem[] => [
        {
            name: "Next page",
            trigger: "Click",
        },
    ],
});

const { settings, setSetting } = useSettings<typeof props>(props);
const { getState } = useSerialization(settings);

const click = () => {
    settings.value.events.forEach((e: EventItem) => {
        if (e.trigger === "Click") {
            console.log(`${e.name} emited`);
            EventBus.emit(e.name, settings.value.selectedValue);
        }
    });
};

const clear = () => {
    settings.value.events.forEach((e: EventItem) => {
        if (e.trigger === "Clear") {
            console.log(`${e.name} emited`);
            EventBus.emit(e.name, settings.value.selectedValue);
        }
    });
};

const scrollBottom = () => {
    settings.value.events.forEach((e: EventItem) => {
        if (e.trigger === "Scroll Bottom") {
            console.log(`${e.name} emited`);
            EventBus.emit(e.name);
        }
    });
};

defineExpose({ setSetting, settings, settingsComponent, getState });
</script>

<template>
    <va-select
        :model-value="settings.selectedValue"
        :label="settings.label"
        :options="settings.options"
        placeholder="Select an option"
        @update:modelValue="click"
        @clear="clear"
        @scrollBottom="scrollBottom"
        clearable
    />
</template>
