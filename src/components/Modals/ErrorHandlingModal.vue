<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" >
import { usePromisifiedModal } from "@/composables/promisifiedModal";
import { ref } from "vue";

export default {
  name: "ErrorHandlingModal",
  setup() {

    const errorMessage = ref("");
    const errorTitle = ref("");
    const opened = (data) => {
      errorMessage.value = data.message;
      errorTitle.value = data.name;
    }

    const { isOpened, run, close } = usePromisifiedModal(() => {}, opened);

    const ok = () => {
      close(null);
    }

    return {
      errorTitle,
      errorMessage,
      isOpened,
      run,
      close,
      ok,
    };
  }
}
</script>

<template>
  <va-modal
    :modelValue="isOpened"
    no-padding
    class="error-modal"
    @ok="ok"
    size="auto"
  >
    <template #content="{ ok }">
      <div class="error-modal-content">
        <div class="m-4">
          <h1 class="mb-4">{{ errorTitle }}</h1>
          <va-divider />
          <pre>{{ errorMessage }}</pre>
        </div>
        <va-button
          preset="secondary"
          class="mr-1 mb-1 close"
          @click="close"
          icon="clear"
        />
      </div>
    </template>
  </va-modal>
</template>

<style lang="scss" scoped>
.error-modal-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 10px;
  width: 100%;

  button {
    align-self: flex-start;
  }
}
</style>
