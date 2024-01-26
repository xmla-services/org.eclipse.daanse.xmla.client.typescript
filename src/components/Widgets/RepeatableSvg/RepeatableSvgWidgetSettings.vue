<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps(["component"]) as any;
const opened = ref({
  textSection: false,
  storeSection: false,
});
</script>

<template>
  <va-collapse v-model="opened.textSection" header="SVG  widget settings">
    <div class="settings-container">
      <va-input v-model="props.component.src" label="src"/>
      <va-input v-model="props.component.repeations" label="repeations"/>
      <va-input v-model="props.component.progress" label="progress"/>
      <div class="colors">
        <va-color-input 
          class="color-input"
          v-model="props.component.activeItemStyles.fill" 
          label="Active item fill"
        />
        <va-color-input 
          class="color-input" 
          v-model="props.component.activeItemStyles.stroke" 
          label="Active item stroke"
        />
      </div>
      <div class="colors">
        <va-color-input 
          class="color-input" 
          v-model="props.component.defaultItemStyles.fill" 
          label="Default item fill"
        />
        <va-color-input 
          class="color-input" 
          v-model="props.component.defaultItemStyles.stroke" 
          label="Default item stroke"
        />
      </div>
    </div>
  </va-collapse>
  <va-collapse v-model="opened.storeSection" header="Store settings">
    <div class="settings-container">
      <div>
        <h3 class="mb-2">Select store</h3>
      </div>
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
.colors {
  display: flex;
  justify-content: space-between;
}
.color-input {
  width: 49%;
}
</style>