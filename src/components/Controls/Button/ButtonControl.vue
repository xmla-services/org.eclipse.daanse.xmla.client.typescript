<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
export interface IButtonSettingsProps {
  title?: string;
  availableEvents?: string[];
  events?: EventItem[];
}

import { inject } from "vue";
import type { EventItem } from "@/@types/controls";
import { useSettings } from "@/composables/widgets/settings";
import { useSerialization } from "@/composables/widgets/serialization";
import ButtonSettings from "@/components/Controls/Button/ButtonSettings.vue";

const settingsComponent = ButtonSettings;
const EventBus = inject("customEventBus") as any;

const props = withDefaults(defineProps<IButtonSettingsProps>(), {
  title: "Next page",
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

const click = () => {
  settings.value.events.forEach((e: EventItem) => {
    if (e.trigger === "Click") {
      console.log(`${e.name} emited`, settings);
      EventBus.emit(e.name);
    }
  });
};

defineExpose({ setSetting, settings, settingsComponent, getState });
</script>

<template>
  <va-button class="button-control" @click="click">
    {{ settings.title }}
  </va-button>
</template>

<style scoped>
.button-control {
  width: 100%;
  height: 100%;
}
</style>
