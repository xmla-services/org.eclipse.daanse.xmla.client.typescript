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
import { ref, type Ref } from "vue";

// const url = "https://ssemenkoff.dev/emondrian/xmla";
export default {
  name: "CellPropertiesModal",
  setup() {
    const memberProperties = ref(null) as Ref<any>;

    const getMemberProperties = async (member) => {
      delete member.__attrs;
      return member;
    };

    const opened = async (data) => {
      memberProperties.value = await getMemberProperties(data.cell);
    };

    const { isOpened, run, close } = usePromisifiedModal(() => {}, opened);

    return {
      isOpened,
      run,
      close,
      memberProperties,
    };
  },
  methods: {
    ok() {
      this.close(null);
    },
  },
};
</script>
<template>
  <va-modal
    :modelValue="isOpened"
    no-padding
    class="cell-properties-modal"
    @ok="ok"
  >
    <template #content="{ ok }">
      <va-card-title class="va-h6">Cell properties</va-card-title>
      <va-card-content>
        <div class="va-table-responsive">
          <table class="va-table va-table--hoverable">
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) in memberProperties" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>
          <va-divider></va-divider>
        </div>
      </va-card-content>
      <va-card-actions>
        <va-button @click="ok">Ok!</va-button>
      </va-card-actions>
    </template>
  </va-modal>
</template>
<style lang="scss">
.cell-properties-modal {
  .va-modal__container {
    width: 100%;
  }

  .server-url-input {
    width: 100%;
  }

  .va-modal__dialog {
    margin: auto;
  }

  table {
    width: 100%;
  }
}
</style>
