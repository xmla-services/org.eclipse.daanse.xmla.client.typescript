<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
import { inject, ref, type Ref, type Component} from "vue";
import ColorSettings from "@/components/Controls/ColorInput/ColorSettings.vue";
import type { EventItem, ComponentProps } from "@/@types/controls";

const EventBus = inject("customEventBus") as any;
const settings: Component = ColorSettings;

const label: Ref<string> = ref('Test');
const selectValue: Ref<string> = ref("#FF00FF");
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
      console.log(`${e.name} emited`);
      EventBus.emit(e.name, selectValue.value);
    }
  });
};

defineExpose({ label, events, availableEvents, settings }) as unknown as ComponentProps;
</script>

<template> 
  <va-color-input
    class="color-control"
    v-model="selectValue"
    :label="label"
    @update:modelValue="click"
  />
</template>

<style lang="scss" scoped>
.color-control {
  width: 100%;
  height: 100%;
}
</style>