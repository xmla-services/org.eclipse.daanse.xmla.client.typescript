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
