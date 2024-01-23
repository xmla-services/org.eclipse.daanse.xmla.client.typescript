<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref } from "vue";

const svgSource = ref("");
const props = defineProps({
  src: {
    type: String,
    required: false,
    default: "",
  },
  classesConfig: {
    type: Object,
    required: false,
    default: null,
  },
});

const styles = computed(() => {
  let string = "";

  const inst = getCurrentInstance();
  const scope = inst?.type.__scopeId;
  if (props.classesConfig) {
    string += "<style>";
    for (const [key, value] of Object.entries(props.classesConfig)) {
      string += `
        [${scope}] .${key} {
          stroke: ${value.stroke};
          fill: ${value.fill};
        }
      `;
    }
    string += "</style>";
  }

  return string;
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
  <div v-html="styles"></div>
  <div class="svg" v-html="svgSource"></div>
</template>

<style scoped>
.svg {
  width: 100%;
  height: 100%;
}
</style>
