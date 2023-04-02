<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts">
import { usePromisifiedModal } from "@/composables/promisifiedModal";
import { usePivotTableStore } from "@/stores/PivotTable";
import { ref } from "vue";

export default {
  name: "PivotTableSettingsModal",
  setup() {
    const pivotTableStore = usePivotTableStore();
    const { isOpened, run, close } = usePromisifiedModal(() => {});

    const showEmpty = ref(pivotTableStore.state.settings.showEmpty);
    const alignContent = ref(pivotTableStore.state.settings.alignContent);
    alignContent.value = alignContent.value.charAt(0).toUpperCase() + alignContent.value.slice(1);

    const textAlignOptions = [
      "Center",
      "Left",
      "Right",
    ]

    return {
      isOpened,
      run,
      close,
      showEmpty,
      alignContent,
      textAlignOptions,
    };
  },
  methods: {
    ok() {
      this.close({
        showEmpty: this.showEmpty,
        alignContent: this.alignContent.toLowerCase(),
      });
    },
  },
};
</script>
<template>
  <va-modal :modelValue="isOpened" no-padding class="server-url-modal" @ok="ok">
    <template #content="{ ok }">
      <va-card-title><h6 class="va-h6">Pivot table settings</h6></va-card-title>
      <va-card-content>
        <div class="mt-3">
          <div class="va-title mb-3">Pivot Table data</div>
          <va-checkbox
            v-model="showEmpty"
            label="Show empty rows/columns"
          />
          <va-divider class="pt-3" />
        </div>
        <div class="mt-5 mb-3">
          <div class="va-title mb-3">Cell styles</div>
          <va-select
            v-model="alignContent"
            label="Align value in cells"
            :options="textAlignOptions"
          />
          <va-divider class="pt-3" />
        </div>
      </va-card-content>
      <va-card-actions>
        <va-button @click="ok" >Save</va-button>
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
