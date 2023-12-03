<script lang="ts" setup>
import { useStoreManager } from "@/composables/storeManager";
import { ref, inject, onMounted, watch } from "vue";
import PlainTextWidgetSettings from "./PlainTextWidgetSettings.vue";
import type { Store } from "@/stores/Widgets/Store";

const EventBus = inject("customEventBus") as any;
const storeManager = useStoreManager();
const settings = PlainTextWidgetSettings;

const storeId = ref("");
const objectField = ref("description");
const text = ref("");

let store = null as unknown as Store;

const setSettings = (settings) => {
  if (settings.field) {
    objectField.value = settings.field;
  }

  if (settings.store) {
    storeId.value = settings.store;
  }
};

watch(storeId, (newVal, oldVal) => {
  console.log("store changed", storeId);
  store = storeManager.getStore(storeId.value);

  console.log(oldVal, newVal);

  EventBus.off(`UPDATE:${oldVal}`, updateFn);
  EventBus.on(`UPDATE:${storeId.value}`, updateFn);

  getData();
});

const updateFn = async () => {
  text.value = (await store?.getData()) as string;
};

const getState = () => ({
  storeId: storeId.value,
  objectField: objectField.value,
});

const setState = (state) => {
  storeId.value = state.storeId;
  objectField.value = state.objectField;

  getData();
};

defineExpose({
  setSettings,
  settings,
  objectField,
  storeId,
  getState,
  setState,
});

const getData = async () => {
  if (!store) return;
  updateFn();
};

onMounted(async () => {
  await getData();
});
</script>

<template>
  <div v-if="objectField">{{ text[objectField] }}</div>
</template>
