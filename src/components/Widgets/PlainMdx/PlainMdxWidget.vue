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
import { ref, watch, computed } from "vue";

const storeManager = useStoreManager();

const props = defineProps({
  storeId: {
    type: String,
    required: true,
  },
});

const store = storeManager.getStore(props.storeId);

// const getValue = () => {
//   return text.value;
// };

// defineExpose({
//   getValue,
// });
const a = computed(() => {
  return store.data;
});

store.getData();
</script>

<template>
  <div>{{ a }}</div>
</template>
