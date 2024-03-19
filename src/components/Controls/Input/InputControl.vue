<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
import type { Ref } from "vue";
import { inject, ref } from "vue";
import InputSettings from "./InputSettings.vue";

const settings = InputSettings;
const EventBus = inject("customEventBus") as any;

const availableEvents = ["Blur", "Input"];

const inputVal = ref("");

const events = ref([]) as unknown as Ref<
  Array<{ name: string; trigger: string }>
>;

const input = () => {
  events.value.forEach((e) => {
    if (e.trigger === "Input") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name);
    }
  });
};

const blur = () => {
  events.value.forEach((e) => {
    if (e.trigger === "Blur") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name, inputVal.value);
    }
  });
};

const label = ref("Sample input");

defineExpose({ label, events, availableEvents, settings });
</script>
<template>
  <va-input
    :label="label"
    @blur="blur"
    v-model="inputVal"
    @update:v-model="input"
  ></va-input>
</template>
