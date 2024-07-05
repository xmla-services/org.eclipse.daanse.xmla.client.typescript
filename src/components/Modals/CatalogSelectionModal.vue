<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts">
import { usePromisifiedModal } from "@/composables/promisifiedModal";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { ref, watch } from "vue";
import { useI18n } from 'vue-i18n';

// const url = "https://ssemenkoff.dev/emondrian/xmla";
export default {
  name: "CatalogSelectionModal",
  setup() {
    const { t } = useI18n();
    const store = useAppSettingsStore();
    const selectedCatalog = ref("");
    const selectedCube = ref("");
    const cubes = ref([] as any[]);
    const catalogs = ref([] as any[]);
    const fetchingCubes = ref(false);
    const fetchingCatalogs = ref(true);
    const error = ref("");

    watch(selectedCatalog, (newVal) => {
      getCubes(newVal);
    });

    const reset = () => {
      selectedCatalog.value = "";
      selectedCube.value = "";
      cubes.value = [];
      fetchingCubes.value = false;
      fetchingCatalogs.value = false;
      error.value = "";
    };

    const opened = async () => {
      const api = store.getApi();
      catalogs.value = (await api.getCatalogs()).catalogs;

      if (catalogs.value.length === 1) {
        selectedCatalog.value = catalogs.value[0].CATALOG_NAME;
      }
      fetchingCatalogs.value = false;
    };

    const { isOpened, run, close } = usePromisifiedModal(reset, opened);

    const getCubes = async (catalogName: string) => {
      if (!selectedCatalog.value) return;
      const api = store.getApi();

      fetchingCubes.value = true;
      cubes.value = [];
      selectedCube.value = "";
      error.value = "";

      try {
        const cubesRes = await api.getCubes(catalogName);
        cubes.value = [...cubesRes.cubes];

        if (cubes.value.length === 1) {
          selectedCube.value = cubes.value[0].CUBE_NAME;
        }
      } catch (e) {
        error.value = "Error occured while loading cubes.";
      } finally {
        fetchingCubes.value = false;
      }
    };

    const ok = () => {
      if (!selectedCube.value) return;
      close({
        cube: selectedCube.value,
        catalog: selectedCatalog.value,
      });
    };

    const onKeyPress = (e) => {
      if (e.key === "Enter") {
        ok();
      }
    };

    watch(isOpened, () => {
      if (isOpened.value) {
        window.addEventListener("keypress", onKeyPress);
      } else {
        window.removeEventListener("keypress", onKeyPress);
      }
    });

    return {
      t,
      store,
      isOpened,
      selectedCatalog,
      run,
      close,
      selectedCube,
      cubes,
      fetchingCubes,
      catalogs,
      fetchingCatalogs,
      error,
      ok
    };
  },
};
</script>
<template>
  <va-modal :modelValue="isOpened" no-padding class="server-url-modal" @ok="ok">
    <template #content="{ ok }">
      <va-card-title class="va-h6">{{ t('CatalogSelectionModal.selectCatalogAndCube') }}</va-card-title>
      <va-card-content>
        <va-select
          :options="catalogs"
          :disabled="fetchingCatalogs"
          :loading="fetchingCatalogs"
          value-by="CATALOG_NAME"
          text-by="CATALOG_NAME"
          v-model="selectedCatalog"
          prevent-overflow
        />
        <va-option-list
          v-if="cubes.length"
          type="radio"
          :options="cubes"
          value-by="CUBE_NAME"
          v-model="selectedCube"
          class="mt-2"
        />
        <div class="mt-2 va-text-danger">{{ error }}</div>
      </va-card-content>
      <va-card-actions>
        <va-button @click="ok">{{ t('Modals.okButton') }}</va-button>
      </va-card-actions>
    </template>
  </va-modal>
</template>
<style lang="scss">
.server-url-modal {
  .va-modal__container {
    width: 100%;
  }

  .server-url-input {
    width: 100%;
  }

  .va-modal__dialog {
    margin: auto;
  }
}
</style>
