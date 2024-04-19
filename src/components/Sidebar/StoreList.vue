<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import StoreList from "@/components/Stores/StoreList.vue";
import { useStoreManager } from "@/composables/storeManager";
import { inject } from "vue";

const EventBus = inject("customEventBus") as any;
const storeManager = useStoreManager();

const addNewStore = () => {
  storeManager.initStore("New store", EventBus);
};

const addNewXMLAStore = () => {
  storeManager.initStore("New store", EventBus, "XMLA");
};
</script>

<template>
  <div class="sidebar-stores">
    <div class="sidebar-stores-title">
      <h2 class="mb-2">Stores</h2>
      <va-button @click="addNewStore">Add new</va-button>
      <va-button class="ml-2" @click="addNewXMLAStore">Add new XMLA</va-button>
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
