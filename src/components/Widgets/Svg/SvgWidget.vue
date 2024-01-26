<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import SvgWidgetSettings from "./SvgWidgetSettings.vue";
const settings = SvgWidgetSettings;

const svgSource = ref("");
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
  settings,
});
</script>

<template>
  <div v-html="styles"></div>
  <div class="svg" v-html="svgSource"></div>
</template>

<style scoped>
.svg {
  width: 100%;
  height: 100%;
}
</style>
