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
import { ref, watch, markRaw } from "vue";
import PlainTextWidget from "./PlainText/PlainTextWidget.vue";
import PlainMdxWidget from "./PlainMdx/PlainMdxWidget.vue";

export default {
  name: "FieldSelectionModal",
  setup() {
    const field = ref("");
    const caption = ref("");
    const options = [
      {
        Caption: "Plain Text",
        Component: markRaw(PlainTextWidget),
      },
      {
        Caption: "Plain MDX",
        Component: markRaw(PlainMdxWidget),
      },
    ];
    const requestResult = ref("");

    const reset = () => {
      field.value = "";
      caption.value = "";
      requestResult.value = "";
    };

    const { isOpened, run, close } = usePromisifiedModal(reset);

    const ok = () => {
      if (!field.value) return;
      close({
        Component: field.value.Component,
        Caption: caption.value,
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
      caption,
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
      <va-card-title class="va-h6">Select component to be add:</va-card-title>
      <va-card-content>
        <va-input
          type="text"
          label="Enter widget title"
          v-model="caption"
          class="mb-4 input"
        ></va-input>
        <va-select
          class="mb-2 input"
          v-model="field"
          :options="options"
          placeholder="Select widget"
          label="Select widget"
          text-by="Caption"
        />
      </va-card-content>
      <va-card-actions>
        <va-button @click="ok" :disabled="!field && !caption">Ok!</va-button>
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
    background-color: var(--app-response-background);
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
