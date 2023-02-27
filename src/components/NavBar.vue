<script lang="ts">
import { useAppSettingsStore } from "@/stores/AppSettings";
import ServerSelectionModal from "@/components/Modals/ServerSelectionModal.vue";
import CatalogSelectionModal from "@/components/Modals/CatalogSelectionModal.vue";

// const url = "https://ssemenkoff.dev/emondrian/xmla";

export default {
  setup() {
    const store = useAppSettingsStore();
    return {
      store,
    };
  },
  methods: {
    async connect() {
      const serverSelectionModal: any = this.$refs.serverSelectionModal;
      const catalogSelectionModal: any = this.$refs.catalogSelectionModal;

      const url = await serverSelectionModal.run();
      await this.store.initXmlaApi(url);

      const { cube, catalog } = await catalogSelectionModal.run();
      await this.store.openCube(catalog, cube);
    },
  },
  components: {
    ServerSelectionModal,
    CatalogSelectionModal,
  },
};
</script>
<template>
  <va-navbar color="primary">
    <template #left>
      <va-navbar-item class="logo">LOGO</va-navbar-item>
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
