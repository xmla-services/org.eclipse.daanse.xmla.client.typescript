<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
export interface IColorSettingsProps {
    label?: string;
    availableEvents?: string[];
    events?: EventItem[];
}

import { inject, ref, type Ref } from "vue";
import { useSettings } from "@/composables/widgets/settings";
import { useSerialization } from "@/composables/widgets/serialization";
import ColorSettings from "@/components/Controls/ColorInput/ColorSettings.vue";
import type { EventItem } from "@/@types/controls";

const EventBus = inject("customEventBus") as any;
const settingsComponent = ColorSettings;

const props = withDefaults(defineProps<IColorSettingsProps>(), {
    label: "Test",
    availableEvents: (): string[] => ["Click"],
    events: (): EventItem[] => [
        {
            name: "Next page",
            trigger: "Click",
        },
    ],
});

const { settings, setSetting } = useSettings<typeof props>(props);
const { getState } = useSerialization(settings);

const selectValue: Ref<string> = ref("#FF00FF");

const click = () => {
    settings.value.events.forEach((e: EventItem) => {
        if (e.trigger === "Click") {
            console.log(`${e.name} emited`);
            EventBus.emit(e.name, selectValue.value);
        }
    });
};

defineExpose({ setSetting, settings, settingsComponent, getState });
</script>

<template>
    <va-color-input
        class="color-control"
        v-model="selectValue"
        :label="settings.label"
        @update:modelValue="click"
    />
</template>

<style lang="scss" scoped>
.color-control {
    width: 100%;
    height: 100%;
}
</style>
