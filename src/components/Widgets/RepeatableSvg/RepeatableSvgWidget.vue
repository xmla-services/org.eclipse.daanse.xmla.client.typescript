<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import RepeatableSvgWidgetSettings from "./RepeatableSvgWidgetSettings.vue";

const settings = RepeatableSvgWidgetSettings;

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
    type: Object,
    required: false,
    default: () => ({
      fill: "#ff0000",
      stroke: "#FFFF00",
    }),
  },
  defaultItemStyles: {
    type: Object,
    required: false,
    default: () => ({
      fill: "#777777",
      stroke: "#777777",
    }),
  },
  repeations: {
    type: Number,
    required: false,
    default: 4,
  },
  progress: {
    type: Number,
    required: false,
    default: 0.5,
  },
});

const { src, activeItemStyles, defaultItemStyles, repeations, progress } = props;

const svgSource = ref(src || "");
const innerActiveItemStyles = ref({ 
  fill: activeItemStyles.fill || '#ff0000',
  stroke: activeItemStyles.stroke || '#FFFF00',
});
const innerDefaultItemStyles = ref({
  fill: defaultItemStyles.fill || '#777777',
  stroke: defaultItemStyles.stroke || '#777777',
});
const innerRepeations = ref(repeations || 4);
const innerProgress = ref(progress || 0.5);


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
  settings,
});
</script>

<template>
  <div class="repeatable-svg-container">
    <svg
      fill="#000000"
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :viewBox="`0 0 ${100 * Number(innerRepeations)} 100`"
      enable-background="new 0 0 100 100"
      xml:space="preserve"
    >
      <defs>
        <mask id="bubbleKenseo">
          <rect
            x="0"
            y="0"
            style="fill: #adadad"
            :width="100 * Number(innerRepeations) * innerProgress"  
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
          v-for="index in Number(innerRepeations)"
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
          v-for="index in Number(innerRepeations)"
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
