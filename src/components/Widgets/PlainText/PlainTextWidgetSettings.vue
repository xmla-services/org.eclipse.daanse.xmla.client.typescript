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
import { ref, watch } from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";

export default {
  name: "FieldSelectionModal",
  setup() {
    const storeManager = useStoreManager();
    const field = ref("");
    const options = ref([] as string[]);
    const requestResult = ref("");
    const url = ref("");
    let store: Store;

    const reset = () => {
      field.value = "";
      url.value = "";
    };

    watch(url, async () => {
      if (url.value) {
        const data = await store.getData(url.value);
        console.log(data);

        requestResult.value = JSON.stringify(data, null, 2);
        options.value = Object.keys(data as any);
      }
    });

    const opened = (storeId) => {
      store = storeManager.getStore(storeId) as Store;
      // requestResult.value = JSON.stringify(data, null, 2);
      // options.value = Object.keys(data);
    };

    const { isOpened, run, close } = usePromisifiedModal(reset, opened);

    const ok = () => {
      if (!field.value) return;
      close({
        field: field.value,
        url: url.value,
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
      field,
      isOpened,
      run,
      close,
      reset,
      ok,
      options,
      requestResult,
      url,
    };
  },
};
</script>
<template>
  <va-modal
    :modelValue="isOpened"
    no-padding
    class="field-selection-modal"
    @ok="ok"
  >
    <template #content="{ ok }">
      <va-card-title class="va-h6">Select field to be displayed:</va-card-title>
      <va-card-content>
        <va-input label="Request URL" v-model="url" class="mb-2"></va-input>
        <va-select
          class="mb-2 input"
          v-model="field"
          :options="options"
          placeholder="Select field"
          label="Select field to be displayed in widget"
        />
        <h4 class="mb-1">Datasource response:</h4>
        <pre class="response">{{ requestResult }}</pre>
      </va-card-content>
      <va-card-actions>
        <va-button @click="ok" :disabled="!field && !url">Ok!</va-button>
      </va-card-actions>
    </template>
  </va-modal>
</template>
<style lang="scss">
.field-selection-modal {
  .va-modal__container {
    width: 100%;
  }

  .response {
    background-color: lightgrey;
    padding: 0.5rem;
    border-radius: 4px;
  }

  .input {
    width: 100%;
  }

  .va-modal__dialog {
    margin: auto;
  }
}
</style>
