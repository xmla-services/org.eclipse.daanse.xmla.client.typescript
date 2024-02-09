<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps(["component"]) as any;
const opened = ref({
  textSection: false,
  storeSection: false,
});

</script>

<template>
  <va-collapse v-model="opened.textSection" header="Video widget settings">
    <div class="settings-container">
      <va-input v-model="props.component.videoUrl" label="Video url" />
      <va-select
        class="mt-2"
        v-model="props.component.videoSettings.fit"
        label="Fit"
        :options="['Cover', 'Contain', 'Stretch', 'Fill', 'None']"
      >
      </va-select>
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

</style>
