<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
import { inject, ref } from "vue";
import ButtonSettings from "@/components/Controls/Button/ButtonSettings.vue";

const EventBus = inject("customEventBus") as any;
const settings = ButtonSettings;

const availableEvents = ["Click"];

const events = ref([
  {
    name: "Next page",
    trigger: "Click",
  },
]);

const click = () => {
  events.value.forEach((e) => {
    if (e.trigger === "Click") {
      console.log(`${e.name} emited`);
      EventBus.emit(e.name);
    }
  });
};

const title = ref("Next page");

defineExpose({ title, events, availableEvents, settings });
</script>
<template>
  <va-button @click="click"> {{ title }} </va-button>
</template>
