<script lang="ts" setup>
import { ref, computed, watch } from "vue";

const props = defineProps(["component"]) as any;
const opened = ref({
  textSection: false,
  storeSection: false,
});

const fields = ref([]);

const addItem = () => {
  return fields.value.push({
    color: '#' + ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6),
    location: Math.floor(Math.random() * 101),
  })
};

watch(
  [() => props.component.fillColor.backgroundColor, () => fields.value],
  ([backgroundColor, fields]) => {
    props.component.fillColor.backgroundColor = backgroundColor;

    props.component.fillColor.backgroundGradient = fields.length === 0
      ? `${backgroundColor} 0, #FAFAFA 85%`
      : fields.map(v => `${v.color} ${v.location}%`).join(', ');
  },
  { deep: true }
);

const deleteField = (id) => {
  fields.value = fields.value.filter((_,i) => i !== id)
}

const progress = computed({
  get: () => props.component.progress,
  set: (value) => {
    const editedProgress = Math.max(0, Math.min(100, value));
    if (editedProgress >= 0) {
      props.component.progress = editedProgress;
    }
  }
});

</script>

<template>
  <va-collapse v-model="opened.textSection" header="Progress widget settings">
    <div class="settings-container">
      <va-input v-model="progress" label="Progress" />
      <va-color-input v-model="props.component.fillColor.backgroundColor" label="Progress fill color" />
      <va-color-input v-model="props.component.backgroundColor" label="Progress background color" />
      <va-checkbox v-model="props.component.isVertical" label="Vertical" />
      <va-checkbox v-model="props.component.isGradient" label="Gradient" />
    </div>
    <div 
      class="mt-3"
      v-if="props.component.isGradient"
    >
      <va-button
        class="add-btn"
        @click="addItem"
      >
        Add color
      </va-button>
      <div>
        <va-input 
          class="mt-2"
          v-model="props.component.rotation" 
          label="Rotation" />
        <va-data-table
          class="table-config"
          :items="fields"
          :columns="[{ key: 'color' }, {key: 'location'}, {key: 'actions'}]"
        >
          <template #cell(color) = {rowIndex}>
            <va-color-input 
              class="input-color"
              v-model="fields[rowIndex].color" 
            />
          </template>
          <template #cell(location) = {rowIndex}>
            <va-input 
              class="input"
              v-model="fields[rowIndex].location" 
            />
          </template>
          <template #cell(actions) = {rowIndex}>
            <va-button 
              icon="delete"
              color="danger"
              @click="deleteField(rowIndex)"
            />
          </template>
        </va-data-table>
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
.add-btn {
  width: 150px;
}
.input {
  width: 100px;
}
</style>
