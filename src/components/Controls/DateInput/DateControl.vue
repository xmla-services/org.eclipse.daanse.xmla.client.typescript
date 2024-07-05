<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
export interface IDateSettingsProps {
    label?: string;
    availableEvents?: string[];
    events?: EventItem[];
}

import { inject, ref, type Ref } from "vue";
import { useSettings } from "@/composables/widgets/settings";
import { useSerialization } from "@/composables/widgets/serialization";
import DateSettings from "@/components/Controls/DateInput/DateSettings.vue";
import type { EventItem } from "@/@types/controls";

const EventBus = inject("customEventBus") as any;
const settingsComponent = DateSettings;

const selectValue: Ref<Date> = ref(new Date(2024, 0, 1));

const props = withDefaults(defineProps<IDateSettingsProps>(), {
    title: "Next page",
    availableEvents: (): string[] => ["Click", "Clear", "Blur", "Focus"],
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
            EventBus.emit(e.name, selectValue.value);
        }
    });
};

const clear = () => {
    settings.value.events.forEach((e: EventItem) => {
        if (e.trigger === "Clear") {
            console.log(`${e.name} emited`);
            EventBus.emit(e.name);
        }
    });
};

const focus = () => {
    settings.value.events.forEach((e: EventItem) => {
        if (e.trigger === "focus") {
            console.log(`${e.name} emited`);
            EventBus.emit(e.name);
        }
    });
};

const blur = () => {
    settings.value.events.forEach((e: EventItem) => {
        if (e.trigger === "blur") {
            console.log(`${e.name} emited`);
            EventBus.emit(e.name);
        }
    });
};
defineExpose({ setSetting, settings, settingsComponent, getState });
</script>

<template>
    <va-date-input
        v-model="selectValue"
        :label="settings.label"
        @update:modelValue="click"
        @clear="clear"
        @blur="blur"
        @focus="focus"
        clearable
    />
</template>
