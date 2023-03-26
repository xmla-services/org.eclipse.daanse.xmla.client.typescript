<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts">
import { useAppSettingsStore } from "@/stores/AppSettings";
import ServerSelectionModal from "@/components/Modals/ServerSelectionModal.vue";
import CatalogSelectionModal from "@/components/Modals/CatalogSelectionModal.vue";
import PivotTableSettingsButton from "@/components/PivotTable/PivotTableSettingsButton.vue";

// const url = "https://ssemenkoff.dev/emondrian/xmla";

export default {
  setup() {
    const store = useAppSettingsStore();
    let windowUri = window.location.search.substring(1);
    let params = new URLSearchParams(windowUri);
    const uri = params.get("uri");
    const cube = params.get("cube");
    const catalog = params.get("catalog");

    return {
      store,
      uri,
      cube,
      catalog,
    };
  },
  methods: {
    async connect() {
      const serverSelectionModal: any = this.$refs.serverSelectionModal;
      const catalogSelectionModal: any = this.$refs.catalogSelectionModal;

      let url = null;
      if (this.uri) {
        url = this.uri;
      } else {
        url = await serverSelectionModal.run();
      }
      await this.store.initXmlaApi(url);

      let cube = null,
        catalog = null;

      if (this.cube && this.catalog) {
        cube = this.cube;
        catalog = this.catalog;
      } else {
        const catalogSelectionResult = await catalogSelectionModal.run();
        cube = catalogSelectionResult.cube;
        catalog = catalogSelectionResult.catalog;
      }

      await this.store.openCube(catalog, cube);
    },
  },
  components: {
    ServerSelectionModal,
    CatalogSelectionModal,
    PivotTableSettingsButton,
  },
};
</script>
<template>

  <va-navbar color="primary" class="mb-3 high_index" >

    <template #left>
      <va-navbar-item class="logo">
        <div class="white triangle"></div>
        <div class="small logo daanse" id="logo"></div>
        <div class="small logo daanse" id="claim"></div>

      </va-navbar-item>

    </template>
    <template #right>
      <va-navbar-item v-if="!store.xmlaApiInited">
        <va-button @click="connect">Connect</va-button>
      </va-navbar-item>
      <va-navbar-item>
        <PivotTableSettingsButton />
      </va-navbar-item>
    </template>

    <Teleport to="body">
      <ServerSelectionModal ref="serverSelectionModal" />
      <CatalogSelectionModal ref="catalogSelectionModal" />
    </Teleport>
  </va-navbar>
</template>

<style lang="scss" scoped>
.high_index{
  z-index: 5;
  overflow: hidden;
  box-shadow: 0px 0px 9px 1px #33333359;

}
#logo{
  width: 66px;
  height: 97px;
  position: absolute;
  left: -10px;
  top: -50px;
  background-size: 138px;
  background-position: 0px;
}
#claim{
  width: 131px;
  height: 97px;
  position: absolute;
  left: 49px;
  top: -50px;
  background-size: 240px;
  background-position: -109px;
}
</style>
