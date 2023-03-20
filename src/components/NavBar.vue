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
  <va-navbar color="primary">
    <template #left>
      <va-navbar-item class="logo">LOGO</va-navbar-item>
      <va-navbar-item>
        <PivotTableSettingsButton />
      </va-navbar-item>
    </template>
    <template #right>
      <va-navbar-item v-if="!store.xmlaApiInited">
        <va-button @click="connect">Connect</va-button>
      </va-navbar-item>
    </template>

    <Teleport to="body">
      <ServerSelectionModal ref="serverSelectionModal" />
      <CatalogSelectionModal ref="catalogSelectionModal" />
    </Teleport>
  </va-navbar>
</template>
