<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
export interface ITimeSettingsProps {
  label?: string;
  availableEvents?: string[];
  events?: EventItem[];
}

import { inject, ref, type Ref } from "vue";
import { useSettings } from "@/composables/widgets/settings";
import { useSerialization } from "@/composables/widgets/serialization";
import TimeSettings from "@/components/Controls/TimeInput/TimeSettings.vue";
import type { EventItem } from "@/@types/controls";

const EventBus = inject("customEventBus") as any;
const settingsComponent = TimeSettings;

const selectValue: Ref<Date> = ref<Date>(new Date());

const props = withDefaults(defineProps<ITimeSettingsProps>(), {
  label: "Test",
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
    if (e.trigger === "Focus") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name);
    }
  });
};

const blur = () => {
  settings.value.events.forEach((e: EventItem) => {
    if (e.trigger === "Blur") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name);
    }
  });
};

defineExpose({ setSetting, settings, settingsComponent, getState });
</script>

<template>
  <va-time-input
    class="time-control"
    v-model="selectValue"
    :label="settings.label"
    @update:modelValue="click"
    @clear="clear"
    @blur="blur"
    @focus="focus"
    clearable
  />
</template>

<style>
.time-control {
  width: 100%;
  height: 100%;
}
</style>
