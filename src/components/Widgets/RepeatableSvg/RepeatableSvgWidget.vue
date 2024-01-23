<script lang="ts" setup>
import { onMounted, ref } from "vue";

const svgSource = ref("");

const props = defineProps({
  src: {
    type: String,
    required: false,
    default: "",
  },
  activeItemStyles: {
    type: Object,
    required: false,
    default: () => ({
      fill: "red",
      stroke: "yellow",
    }),
  },
  defaultItemStyles: {
    type: Object,
    required: false,
    default: () => ({
      fill: "#777",
      stroke: "#777",
    }),
  },
  repeations: {
    type: Number,
    required: false,
    default: 1,
  },
  progress: {
    type: Number,
    required: false,
    default: 0.5,
  },
});

onMounted(async () => {
  const req = await fetch(props.src);
  const svgObject = await req.text();
  svgSource.value = svgObject;
});

defineExpose({
  // settings,
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
      :viewBox="`0 0 ${100 * props.repeations} 100`"
      enable-background="new 0 0 100 100"
      xml:space="preserve"
    >
      <defs>
        <mask id="bubbleKenseo">
          <rect
            x="0"
            y="0"
            style="fill: #adadad"
            :width="100 * props.repeations * props.progress"
            height="100"
          />
        </mask>
      </defs>
      <g
        :fill="props.defaultItemStyles.fill"
        :stroke="props.defaultItemStyles.stroke"
      >
        <g
          v-html="svgSource"
          v-for="index in props.repeations"
          :transform="`translate(${100 * (index - 1)}, 0)`"
          :key="index"
        ></g>
      </g>
      <g
        mask="url(#bubbleKenseo)"
        :fill="props.activeItemStyles.fill"
        :stroke="props.activeItemStyles.stroke"
      >
        <g
          v-html="svgSource"
          v-for="index in props.repeations"
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
