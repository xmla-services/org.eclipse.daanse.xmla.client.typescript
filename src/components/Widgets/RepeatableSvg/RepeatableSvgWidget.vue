<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { onMounted, ref, watch, inject, computed, type Ref, type Component, PropType } from "vue";
import RepeatableSvgWidgetSettings from "./RepeatableSvgWidgetSettings.vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";
import type { ItemStyles, RepeatableSvgComponentProps, RepeatableSvgSharingComponentProps } from "@/@types/widgets";
const settings: Component = RepeatableSvgWidgetSettings;

const EventBus = inject("customEventBus") as any;
const storeManager = useStoreManager();
const storeId: Ref<string> = ref("");
const data = ref(null as unknown);

let store = null as unknown as Store;

const props = defineProps({
  initialState: {
    type: Object,
    required: false,
  },
  src: {
    type: String,
    required: false,
    default: "/demo/human.svg",
  },
  activeItemStyles: {
    type: Object as PropType<ItemStyles>,
    required: false,
    default: () => ({
      fill: "#ff0000",
      stroke: "#FFFF00",
    }),
  },
  defaultItemStyles: {
    type: Object as PropType<ItemStyles>,
    required: false,
    default: () => ({
      fill: "#777777",
      stroke: "#777777",
    }),
  },
  repeations: {
    type: String,
    required: false,
    default: '4',
  },
  progress: {
    type: String,
    required: false,
    default: '0.5',
  },
}) as RepeatableSvgComponentProps;

const { src, activeItemStyles, defaultItemStyles, repeations, progress } = props;

const svgSource: Ref<string> = ref(src || "");
const innerActiveItemStyles: Ref<ItemStyles> = ref({
  fill: activeItemStyles?.fill || '#ff0000',
  stroke: activeItemStyles?.stroke || '#FFFF00',
});
const innerDefaultItemStyles: Ref<ItemStyles> = ref({
  fill: defaultItemStyles?.fill || '#777777',
  stroke: defaultItemStyles?.stroke || '#777777',
});
const innerRepeations: Ref<string> = ref(repeations || '4');
const innerProgress: Ref<string> = ref(progress || '0.5');

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

onMounted(async () => {
  if(!props.src) return;
  const req = await fetch(props.src);
  const svgObject = await req.text();
  svgSource.value = svgObject;

});

defineExpose({
  src: svgSource,
  activeItemStyles: innerActiveItemStyles,
  defaultItemStyles: innerDefaultItemStyles,
  progress: innerProgress,
  repeations: innerRepeations,
  storeId,
  settings,
  getState,
}) as unknown as RepeatableSvgSharingComponentProps;

const createParsedData = (prop) => {
  return computed(() => {
    let processedString = String(prop.value);
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
}

const svgProgressParse: Ref<string> = createParsedData(innerProgress);

const repeationsToNumber: Ref<number> = computed(() => {
  return !isNaN(parseFloat(innerRepeations.value)) ? Math.floor(Number(innerRepeations.value)) : 0;
})

const progressToNumber: Ref<number> = computed(() => {
  return !isNaN(parseFloat(svgProgressParse.value)) ? Number(svgProgressParse.value) : 0;
})

</script>

<template>
  <div class="repeatable-svg-container">
    <svg
      fill="#000000"
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :viewBox="`0 0 ${100 * repeationsToNumber} 100`"
      enable-background="new 0 0 100 100"
      xml:space="preserve"
    >
      <defs>
        <mask id="bubbleKenseo">
          <rect
            x="0"
            y="0"
            style="fill: #adadad"
            :width="100 * repeationsToNumber * progressToNumber"  
            height="100"
          />
        </mask>
      </defs>
      <g
        :fill="innerDefaultItemStyles.fill"
        :stroke="innerDefaultItemStyles.stroke"
      >
        <g
          v-html="svgSource"
          v-for="index in repeationsToNumber"
          :transform="`translate(${100 * (index - 1)}, 0)`"
          :key="index"
        ></g>
      </g>
      <g
        mask="url(#bubbleKenseo)"
        :fill="innerActiveItemStyles.fill"
        :stroke="innerActiveItemStyles.stroke"
      >
        <g
          v-html="svgSource"
          v-for="index in repeationsToNumber"
          :transform="`translate(${100 * (index - 1)}, 0)`"
          :key="index"
        ></g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.repeatable-svg-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  object-fit: contain;
}

.svg {

}
</style>
