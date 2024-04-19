<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref, watch, inject, type Ref, type Component, PropType } from "vue";
import SvgWidgetSettings from "./SvgWidgetSettings.vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";
import type { Config, RepeatableSvgSharingComponentProps, SvgComponentProps } from "@/@types/widgets";
const settings: Component = SvgWidgetSettings;

const EventBus = inject("customEventBus") as any;
const storeManager = useStoreManager();
const storeId: Ref<string> = ref("");
const data = ref(null as unknown);
const svgSource: Ref<string> = ref("");
const inst = getCurrentInstance();
const scope = inst?.type.__scopeId;

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
    type: Object as PropType<Config>,
    required: false,
    default: null,
  },
}) as SvgComponentProps;

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

const innerClassesConfig: Ref<Config> = ref(props.classesConfig || null);

const styles: Ref<string> = computed(() => {
  let string: string = "";

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
}) as unknown as RepeatableSvgSharingComponentProps;

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
