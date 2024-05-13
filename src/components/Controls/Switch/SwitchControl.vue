<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
export interface ISwitchSettingsProps {
  label?: string;
  availableEvents?: string[];
  events?: EventItem[];
}

import { inject, ref, type Ref } from "vue";
import { useSettings } from "@/composables/widgets/settings";
import { useSerialization } from "@/composables/widgets/serialization";
import SwitchSettings from "@/components/Controls/Switch/SwitchSettings.vue";
import type { EventItem } from "@/@types/controls";

const EventBus = inject("customEventBus") as any;
const settingsComponent = SwitchSettings;

const isChecked: Ref<boolean> = ref(false);

const props = withDefaults(defineProps<ISwitchSettingsProps>(), {
  label: "Test",
  availableEvents: (): string[] => ["Blur", "Focus", "Update", "Click"],
  events: (): EventItem[] => [
    {
      name: "Next page",
      trigger: "Update",
    },
  ],
});

const { settings, setSetting } = useSettings<typeof props>(props);
const { getState } = useSerialization(settings);

const click = () => {
  isChecked.value = !isChecked.value;
  settings.value.events.forEach((e: EventItem) => {
    if (e.trigger === "Click") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name);
    }
  });
};

const update = () => {
  settings.value.events.forEach((e: EventItem) => {
    if (e.trigger === "Update") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name, isChecked.value);
    }
  });
};

const blur = () => {
  settings.value.events.forEach((e: EventItem) => {
    if (e.trigger === "Blur") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name, isChecked.value);
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

defineExpose({ setSetting, settings, settingsComponent, getState });
</script>

<template>
  <va-switch
    class="custom-switch"
    v-model="isChecked"
    :label="settings.label"
    @click="click"
    @update:modelValue="update"
    @blur="blur"
    @focus="focus"
  />
</template>
