<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
import { inject, ref, type Ref, type Component } from "vue";
import SwitchSettings from "@/components/Controls/Switch/SwitchSettings.vue";
import type { ComponentProps, EventItem } from "@/@types/controls";

const EventBus = inject("customEventBus") as any;
const settings: Component = SwitchSettings;

const label: Ref<string> = ref('Test');
const isChecked: Ref<boolean> = ref(false);
const availableEvents: string[] = ["Blur", "Focus", "Update", "Click"];

const events: Ref<EventItem[]> = ref([
  {
    name: "Next page",
    trigger: "Update",
  },
]);

const click = () => {
  isChecked.value = !isChecked.value;
  events.value.forEach((e) => {
    if (e.trigger === "Click") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name);
    }
  });
};

const update = () => {
  events.value.forEach((e: EventItem) => {
    if (e.trigger === "Update") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name, isChecked.value);
    }
  });
};

const blur = () => {
  events.value.forEach((e: EventItem) => {
    if (e.trigger === "Blur") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name, isChecked.value);
    }
  });
};

const focus = () => {
  events.value.forEach((e: EventItem) => {
    if (e.trigger === "Focus") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name);
    }
  });
};

defineExpose({ label, events, availableEvents, settings }) as unknown as ComponentProps;
</script>

<template> 
  <va-switch 
    class="custom-switch"
    v-model="isChecked" 
    :label="label"
    @click="click"
    @update:modelValue="update"
    @blur="blur"
    @focus="focus"
  />
</template>
