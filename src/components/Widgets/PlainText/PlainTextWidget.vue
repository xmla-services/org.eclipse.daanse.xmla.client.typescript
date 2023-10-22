<script lang="ts" setup>
import { useStoreManager } from "@/composables/storeManager";
import { ref, watch } from "vue";

const storeManager = useStoreManager();

const props = defineProps({
  storeId: {
    type: String,
    required: true,
  },
});

const objectField = ref("");
const text = ref("");
const url = ref("");
const store = storeManager.getStore(props.storeId);

const setSettings = (settings) => {
  objectField.value = settings.field;
  url.value = settings.url;
};

const getValue = () => {
  return text.value;
};

defineExpose({
  setSettings,
  getValue,
});

watch(url, async () => {
  if (url.value) {
    text.value = (await store?.getData(url.value)) as string;
  }
});
</script>

<template>
  <div v-if="objectField">{{ text[objectField] }}</div>
</template>
