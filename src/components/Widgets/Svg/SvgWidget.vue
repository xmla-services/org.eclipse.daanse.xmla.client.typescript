<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref, watch, inject } from "vue";
import SvgWidgetSettings from "./SvgWidgetSettings.vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";
const settings = SvgWidgetSettings;

const EventBus = inject("customEventBus") as any;
const storeManager = useStoreManager();
const storeId = ref("");
const data = ref(null as unknown);
const svgSource = ref("");

let store = null as unknown as Store;

const props = defineProps({
  initialState: {
    type: Object,
    required: false,
  },
  src: {
    type: String,
    required: false,
    default: "/demo/test.svg",
  },
  classesConfig: {
    type: Object,
    required: false,
    default: null,
  },
});

const getState = () => {
  return {
    storeId: storeId.value,
  };
};

const getData = async () => {
  if (!store) return;
  updateFn();
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
  data.value = await store?.getData();
  console.log(data);
};

const innerClassesConfig = ref(props.classesConfig || null);

const styles = computed(() => {
  let string = "";

  const inst = getCurrentInstance();
  const scope = inst?.type.__scopeId;
  if (innerClassesConfig.value) {
    string += "<style>";
    for (const [key, value] of Object.entries(innerClassesConfig.value)) {
      string += `
        [${scope}] .${key} {
          stroke: ${value.stroke};
          fill: ${value.fill};
          stroke-width: ${value.strokeWidth};
        }
      `;
    }
    string += "</style>";
  }

  return string;
});

onMounted(async () => {
  if(!props.src) return;
  const req = await fetch(props.src);
  const svgObject = await req.text();
  svgSource.value = svgObject;
});

defineExpose({
  src: svgSource,
  classesConfig: innerClassesConfig,
  storeId,
  settings,
  getState,
});

const svgSourceParced = computed(() => {
  let processedString = svgSource.value;
  const regex = /{(.*?)}/g;
  const parts = processedString.match(regex);

  if (!parts || !data.value) {
    return processedString;
  }

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
  <div v-html="styles"></div>
  <div class="svg" v-html="svgSourceParced"></div>
</template>

<style scoped>
.svg {
  width: 100%;
  height: 100%;
}
</style>
