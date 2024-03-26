<script lang="ts" setup>
import { ref, watch, inject, computed } from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";
import RichTextWidgetSettings from "./RichTextWidgetSettings.vue";
const settings = RichTextWidgetSettings;

const EventBus = inject("customEventBus") as any;
const storeManager = useStoreManager();
const storeId = ref("");
const data = ref(null as unknown);

let store = null as unknown as Store;

const props = defineProps({
  initialState: {
    type: Object,
    required: false,
  },
  editor: {
    type: String,
    required: false,
    default: "",
  },
});

const innerEditor = ref(props.editor || "");

const getState = () => {
  return {
    storeId: storeId.value,
  };
};

defineExpose({
  editor: innerEditor,
  getState,
  storeId,
  settings,
});

const getData = async () => {
  if (!store) return;
  updateFn();
};

watch(
  storeId, 
  (newVal, oldVal) => {
  console.log("store changed", storeId);
  store = storeManager.getStore(storeId.value);

  console.log(oldVal, newVal);

  EventBus.off(`UPDATE:${oldVal}`, updateFn);
  EventBus.on(`UPDATE:${storeId.value}`, updateFn);

  getData();
});

const updateFn = async () => {
  data.value = await store?.getData();
  console.log(data);
};

const parsedEditorText = computed(() => {
  let processedString = innerEditor.value;
  const regex = /{(.*?)}/g;
  const parts = processedString.match(regex);

  if (!parts || !data.value) return processedString;

  parts.forEach((element: string) => {
    const trimmedString = element.replace("{", "").replace("}", "");
    const dataField = trimmedString.split(".");

    const res = dataField.reduce((acc: any, field) => {
      return acc[field];
    }, data.value);
    processedString = processedString.replace(element, res);
  });
  return processedString;
});
</script>

<template>
  <div class="text-container">
    <div class="editor-content" v-html="parsedEditorText"/>
  </div>
</template>

<style lang="scss">
.text-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 1rem;
  align-items: stretch;
}

.editor-content {
  width: 100%;
  height: 100%;
  overflow-wrap: anywhere;

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  h4 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  h5 {
    font-size: 1.11rem;
    margin-bottom: 1rem;
  }
  
  h6 {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
}
</style>
