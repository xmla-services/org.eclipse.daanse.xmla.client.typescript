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
import TimeSettings from "@/components/Controls/TimeInput/TimeSettings.vue";
import type { EventItem, ComponentProps } from "@/@types/controls";

const EventBus = inject("customEventBus") as any;
const settings: Component = TimeSettings;

const label: Ref<string> = ref<string>('Test');
const selectValue: Ref<Date> = ref<Date>(new Date());
const availableEvents: string[] = ["Click", "Clear", "Blur", "Focus"];

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
      EventBus.emit(e.name);
    }  
  });
};

const focus = () => {
  events.value.forEach((e: EventItem) => {
    if(e.trigger === "Focus") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name);
    }
  });
};

const blur = () => {
  events.value.forEach((e: EventItem) => {
    if(e.trigger === "Blur") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name);
    }
  });
};

defineExpose({ label, events, availableEvents, settings }) as unknown as ComponentProps;
</script>

<template> 
  <va-time-input
    class="time-control"
    v-model="selectValue"
    :label="label"
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