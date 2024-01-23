<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps(["wrapper"]) as any;
const opened = ref(false);
</script>

<template>
  <va-collapse v-model="opened" header="Widget wrapper settings">
    <div class="settings-container">
      <va-input v-model="props.wrapper.title" label="Title" />
      <va-input v-model="props.wrapper.titleFontSize" label="Title Font Size" />
      <va-input v-model="props.wrapper.titleColor" label="Title Font Color" />
      <va-input
        v-model="props.wrapper.backgroundColor"
        label="Background Color"
      />
      <va-input v-model="props.wrapper.borderSize" label="Border Size" />
      <va-input v-model="props.wrapper.borderColor" label="Border Color" />
      <va-input v-model="props.wrapper.borderRadius" label="Border Radius" />
      <va-checkbox
        v-model="props.wrapper.fullscreen"
        label="Show fullscreen button"
      />
    </div>
  </va-collapse>
</template>
<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}
</style>
