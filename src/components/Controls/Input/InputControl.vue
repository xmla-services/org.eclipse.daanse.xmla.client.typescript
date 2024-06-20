<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
export interface IInputSettingsProps {
    label?: string;
    availableEvents?: string[];
    events?: EventItem[];
}

import { inject, ref, type Ref } from "vue";
import { useSettings } from "@/composables/widgets/settings";
import { useSerialization } from "@/composables/widgets/serialization";
import InputSettings from "./InputSettings.vue";
import type { EventItem } from "@/@types/controls";

const settingsComponent = InputSettings;
const EventBus = inject("customEventBus") as any;

const inputVal: Ref<string> = ref("");

const props = withDefaults(defineProps<IInputSettingsProps>(), {
    label: "Next page",
    availableEvents: (): string[] => ["Blur", "Input"],
    events: (): EventItem[] => [
        {
            name: "Next page",
            trigger: "Input",
        },
    ],
});

const { settings, setSetting } = useSettings<typeof props>(props);
const { getState } = useSerialization(settings);

const input = () => {
    settings.value.events.forEach((e: EventItem) => {
        if (e.trigger === "Input") {
            console.log(`${e.name} emited`);
            EventBus.emit(e.name);
        }
    });
};

const blur = () => {
    settings.value.events.forEach((e: EventItem) => {
        if (e.trigger === "Blur") {
            console.log(`${e.name} emited`);
            EventBus.emit(e.name, inputVal.value);
        }
    });
};

defineExpose({ setSetting, settings, settingsComponent, getState });
</script>

<template>
    <va-input
        class="input-control"
        :label="settings.label"
        @blur="blur"
        v-model="inputVal"
        @update:modelValue="input"
    ></va-input>
</template>

<style scoped>
.input-control {
    width: 100%;
    height: 100%;
}
</style>
