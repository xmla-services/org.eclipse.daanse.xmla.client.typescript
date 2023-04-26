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

export default {
  name: "InfoBox",
  setup() {

    const reset = () => {

    };

    const { isOpened, run, close } = usePromisifiedModal(reset);

    const ok = () => {

      close(null);
    };

    const onKeyPress = (e) => {
      if (e.key === "Enter" || e.key==='Escape') {
        close(null);
      }
    };

    watch(isOpened, () => {
      if (isOpened.value) {
        window.addEventListener("keyup", onKeyPress);
      } else {
        window.removeEventListener("keyup", onKeyPress);
      }
    });
    isOpened.value = true;
    return {
      isOpened,
      run,
      close,
      reset,
      ok,
    };
  },
  props:{
    infoUri: String,
  }
};
</script>
<template>
  <va-modal :modelValue="isOpened" no-padding class="infobox" @ok="ok">
    <template #content="{ ok }">
      <va-button
          preset="secondary"
          class="mr-1 mb-1 close"
          @click="close"
      >
        x
      </va-button>
      <va-card-content>

        <iframe v-if="infoUri" :src="infoUri"  name="myiFrame" scrolling="no" frameborder="1" marginheight="0px" marginwidth="0px" height="400px" width="600px" ></iframe>
      </va-card-content>


    </template>
  </va-modal>
</template>
<style lang="scss">
.infobox {
  .va-modal__container {
    width: 100%;
  }

  .server-url-input {
    width: 100%;
  }

  .va-modal__dialog {
    margin: auto;
  }
  .close{
    width: 25px;
    height: 25px;
    position: absolute;
    right: 0;
    z-index: 5;
    top: 3px;
  }
}
</style>
