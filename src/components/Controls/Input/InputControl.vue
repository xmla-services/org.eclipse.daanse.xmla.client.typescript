<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
import { inject, ref, type Ref } from "vue";
import InputSettings from "./InputSettings.vue";
import type { Component } from 'vue';
import type { ComponentProps, EventItem } from "@/@types/controls";

const settings: Component = InputSettings;

const EventBus = inject("customEventBus") as any;

const label: Ref<string> = ref("Sample input");
const availableEvents: string[] = ["Blur", "Input"];
const inputVal: Ref<string> = ref("");
  
const events: Ref<EventItem[]> = ref([
  {
    name: "Next page",
    trigger: "Input",
  },
]);

const input = () => {
  events.value.forEach((e: EventItem) => {
    if (e.trigger === "Input") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name);
    }
  });
};

const blur = () => {
  events.value.forEach((e: EventItem) => {
    if (e.trigger === "Blur") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name, inputVal.value);
    }
  });
};

defineExpose({ label, events, availableEvents, settings }) as unknown as ComponentProps;
</script>

<template>
  <va-input
    class="input-control"
    :label="label"
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