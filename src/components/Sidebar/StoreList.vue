<script lang="ts" setup>
import StoreList from "@/components/Stores/StoreList.vue";
import { useStoreManager } from "@/composables/storeManager";
import { inject } from "vue";

const EventBus = inject("customEventBus") as any;
const storeManager = useStoreManager();

const addNewStore = () => {
  storeManager.initStore("New store", EventBus);
};
</script>

<template>
  <div class="sidebar-stores">
    <div class="sidebar-stores-title">
      <h2 class="mb-2">Stores</h2>
      <va-button @click="addNewStore">Add new</va-button>
    </div>
    <StoreList class="mt-2" />
  </div>
</template>

<style lang="css">
.settings-sidebar {
  background-color: white;
  height: 100%;
  width: 100%;
}

.sidebar-stores {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 10px;
  width: 100%;
}

.sidebar-stores-title {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.sidebar-stores-title > h2 {
  font-size: 24px;
  flex-grow: 1;
}
</style>
