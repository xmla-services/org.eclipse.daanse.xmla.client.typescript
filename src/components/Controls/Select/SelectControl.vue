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
import SelectSettings from "@/components/Controls/Select/SelectSettings.vue";
import type { SelectComponentProps, EventItem } from "@/@types/controls";

const EventBus = inject("customEventBus") as any;
const settings: Component = SelectSettings;

const label: Ref<string> = ref('Test');
const selectValue: Ref<string> = ref('');
const options: Ref<string[]> = ref([]);
const availableEvents: string[] = ["Click", "Clear", "Scroll Bottom"];

const events: Ref<EventItem[]> = ref([
  {
    name: "Next page",
    trigger: "Click",
  },
]);

const click = () => {
  events.value.forEach((e: EventItem) => {
    if (e.trigger === "Click") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name, selectValue.value);
    }
  });
};

const clear = () => {
  events.value.forEach((e: EventItem) => {
    if(e.trigger === "Clear") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name, selectValue.value);
    }  
  });
};

const scrollBottom = () => {
  events.value.forEach((e: EventItem) => {
    if(e.trigger === "Scroll Bottom") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name);
    }
  });
};

defineExpose({ label, events, options, availableEvents, settings, selectValue }) as unknown as SelectComponentProps;
</script>

<template> 
  <va-select
    v-model="selectValue"
    :label="label"
    :options="options"
    placeholder="Select an option"
    @update:modelValue="click"
    @clear="clear"
    @scrollBottom="scrollBottom"
    clearable
  />
</template>

