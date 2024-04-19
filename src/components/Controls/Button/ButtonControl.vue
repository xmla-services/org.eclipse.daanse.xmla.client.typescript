<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
import { inject, ref, type Component, type Ref } from "vue";
import type { EventItem, ButtonComponentProps } from "@/@types/controls";
import ButtonSettings from "@/components/Controls/Button/ButtonSettings.vue";

const settings: Component = ButtonSettings;
const title: Ref<string> = ref("Next page");
const EventBus = inject("customEventBus") as any;
const availableEvents: string[] = ["Click"];

const events: Ref<EventItem[]> = ref([
  {
    name: "Next page",
    trigger: "Click",
  },
]);

const click = () => {
  events.value.forEach((e: EventItem) => {
    if (e.trigger === "Click") {
      console.log(`${e.name} emited`, settings);
      EventBus.emit(e.name);
    }
  });
};

defineExpose({ title, events, availableEvents, settings }) as unknown as ButtonComponentProps;
</script>

<template>
  <va-button class="button-control" @click="click"> {{ title }} </va-button>
</template>

<style scoped>
.button-control {
  width: 100%;
  height: 100%;
}
</style>