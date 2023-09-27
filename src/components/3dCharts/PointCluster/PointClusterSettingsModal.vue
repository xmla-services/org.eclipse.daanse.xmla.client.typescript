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
import { useMetadataStorage } from "@/composables/metadataStorage";
import { ref, watch } from "vue";

export default {
  name: "PointClusterSettingsModal",
  setup() {
    const metadataStorage = useMetadataStorage();

    const xMeasure = ref(null);
    const yMeasure = ref(null);
    const zMeasure = ref(null);
    const measures = ref([] as any[]);

    const reset = () => {};

    const { isOpened, run, close } = usePromisifiedModal(reset);

    const ok = () => {
      close({
        xMeasure: xMeasure.value,
        yMeasure: yMeasure.value,
        zMeasure: zMeasure.value,
      });
    };

    const init = async () => {
      const metadata = await metadataStorage.getMetadataStorage();
      measures.value = [...metadata.measures];
    };

    init();

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
      isOpened,
      run,
      close,
      reset,
      ok,
      xMeasure,
      yMeasure,
      zMeasure,
      measures,
    };
  },
};
</script>
<template>
  <va-modal :modelValue="isOpened" no-padding class="server-url-modal" @ok="ok">
    <template #content="{ ok }">
      <va-card-title class="va-h6">3d Chart settings</va-card-title>
      <va-card-content>
        <div class="mb-4">
          <va-select
            :options="measures"
            text-by="MEASURE_NAME"
            label="Measure for x-axis"
            v-model="xMeasure"
            prevent-overflow
          />
        </div>
        <div class="mb-4">
          <va-select
            :options="measures"
            text-by="MEASURE_NAME"
            label="Measure for y-axis"
            v-model="yMeasure"
            prevent-overflow
          />
        </div>
        <div>
          <va-select
            :options="measures"
            text-by="MEASURE_NAME"
            label="Measure for z-axis"
            v-model="zMeasure"
            prevent-overflow
          />
        </div>
      </va-card-content>
      <va-card-actions>
        <va-button @click="ok">Ok!</va-button>
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
