<script lang="ts" setup>
import { v4 } from "uuid";
import { ref } from "vue";

const props = defineProps(["component"]) as any;

const addNew = () => {
  console.log(props.component);
  props.component.images.push({
    id: v4(),
    url: "Test",
  });
};

const opened = ref(false);
</script>

<template>
  <va-collapse v-model="opened" header="Image widget settings">
    <div class="settings-container">
      <va-button @click="addNew">Add image</va-button>
      <div class="image-list-container">
        <div
          v-for="image in props.component.images"
          :key="image.id"
          class="image-settings-container"
        >
          <va-input
            v-model="image.url"
            label="Image src"
            class="image-settings-remove-input"
          />
          <va-button
            @click="() => props.component.images.splice(image, 1)"
            icon="clear"
            class="image-settings-remove-button"
          />
          <!-- {{ image.url }} -->
        </div>
      </div>
      <va-select
        v-model="props.component.imageSettings.fit"
        label="Fit"
        :options="['Cover', 'Contain', 'Stretch', 'Fill', 'None']"
      >
      </va-select>
      <va-input
        v-model="props.component.imageSettings.diashowInterval"
        label="Diashow interval"
      >
      </va-input>
    </div>
  </va-collapse>
</template>
<style scoped>
.image-settings-container {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 1rem;
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.image-settings-remove-button {
  margin-bottom: 0.25rem;
}

.image-settings-remove-input {
  flex-grow: 1;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-list-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 500px;
  overflow: auto;
  padding: 0.5rem;
  background-color: #eee;
  border-radius: 0.5rem;
}
</style>
