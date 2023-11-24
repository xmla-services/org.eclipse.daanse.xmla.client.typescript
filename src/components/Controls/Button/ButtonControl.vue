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
