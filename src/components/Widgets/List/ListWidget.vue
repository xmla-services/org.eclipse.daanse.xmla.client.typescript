<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { useStoreManager } from "@/composables/storeManager";
import { ref, inject, onMounted } from "vue";

const storeManager = useStoreManager();

const props = defineProps({
  storeId: {
    type: String,
    required: true,
  },
});

const EventBus = inject("customEventBus") as any;
const objectField = ref("description");
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

EventBus.on(`UPDATE:${props.storeId}`, async () => {
  text.value = (await store?.getData()) as string;
});

onMounted(async () => {
  text.value = (await store?.getData()) as string;
});
</script>

<template>
  <div>{{ text }}</div>
</template>
