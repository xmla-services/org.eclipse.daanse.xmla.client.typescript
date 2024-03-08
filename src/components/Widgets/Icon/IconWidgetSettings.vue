<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";

const props = defineProps(["component"]) as any;
const opened = ref({
  textSection: false,
  storeSection: false,
});

const innerIconList = ref([]);
const searchQuery = ref('');

function filterUniqueIcons(icons) {
  const uniqueNames = new Set();
  return icons.filter((icon) => {
    if (!uniqueNames.has(icon.name)) {
      uniqueNames.add(icon.name);
      return true;
    }
    return false;
  });
}

const filteredIcons = computed(() => {
  return innerIconList.value.filter((icon) =>
    icon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleIconClick = (icon) => {
  if (icon) props.component.currentIcon = icon.name;
};

onMounted(async () => {
  const req = await fetch('src/assets/icons/MaterialIcons.json');
  const iconsArray = await req.json();
  innerIconList.value = filterUniqueIcons(iconsArray);
});
</script>

<template>
  <va-collapse 
    v-model="opened.textSection" 
    header="Icon widget settings"
  >
    <div class="settings-container">
      <va-input 
        v-model="searchQuery" 
        placeholder="Search icon..." 
        label="Search icons"
      />
      <div class="icons-container" style="font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 100, 'opsz' 48;">
        <span
          v-for="icon in filteredIcons"
          :key="icon.name + icon.version"
          @click="handleIconClick(icon)"
          :class="{ 'active-icon': icon.name === props.component.currentIcon }"
          class="material-symbols-outlined"
        >
          {{ icon.name }}
        </span>
      </div>
      <va-checkbox 
        v-model="props.component.isIconFilled" 
        label="Icon filled"
      />
      <va-color-input 
        v-model="props.component.iconColor" 
        label="Icon color"
      />
      <va-input
        v-model="props.component.iconSize" 
        label="Icon size"
      />
      <va-slider 
        class="slider"
        v-model="props.component.strokeWeight"
        track-label-visible
        :min="100" 
        :max="700" 
        :step="100"
        label="Stroke weight"
      />
      <va-slider 
        class="slider"
        v-model="props.component.opticSize"
        track-label-visible
        :min="20" 
        :max="48" 
        label="Optic size"
      />
      <va-slider 
        class="slider"
        v-model="props.component.emphasis"
        track-label-visible
        :min="-25" 
        :max="200"
        :step="15"
        label="emphasis"
      />
    </div>
  </va-collapse>
  <va-collapse 
    v-model="opened.storeSection" 
    header="Store settings"
  >
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

.icons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 220px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  cursor: pointer;
  padding: 10px;
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: inherit;
  font-size: 40px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  border: 2px solid transparent;
  border-radius: 5px;
  transition: border-color 0.5s ease, transform 0.5s ease;
}

.material-symbols-outlined:hover {
  transform: scale(1.1);
}

.active-icon {
  border: 2px solid rgb(0, 121, 0);
}

.slider {
  padding: 0 10px;
}
</style>
