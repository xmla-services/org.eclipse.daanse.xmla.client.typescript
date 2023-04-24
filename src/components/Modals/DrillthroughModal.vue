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
import { useAppSettingsStore } from "@/stores/AppSettings";
import { getDrillthroughRequest } from "@/utils/MdxRequests/Drillthrough";
import { computed } from "vue";
import { ref, type Ref } from "vue";

export default {
  name: "DrillthroughModal",
  setup() {
    const drillthroughContent = ref([]) as Ref<any[]>;
    const appSettings = useAppSettingsStore();
    const api = appSettings.getApi();
    const columnsDesc = ref([]) as Ref<any[]>;
    const reset = () => {
      drillthroughContent.value = [];
    };

    const opened = async ({ rows, columns }) => {
      const drillthroughRequest = getDrillthroughRequest(rows, columns);

      const mdxResponce = await api.getDrillthroughMDX(drillthroughRequest);
      drillthroughContent.value =
        mdxResponce.Body.ExecuteResponse.return.root.row;
      columnsDesc.value =
        mdxResponce.Body.ExecuteResponse.return.root.schema.complexType.sequence.element.map(
          (e) => {
            return {
              caption: e.__attrs["sql:field"],
              name: e.__attrs.name,
            };
          }
        );
    };

    const tableColumns = computed(() =>
      columnsDesc.value.map((e) => e.caption)
    );
    const tableRows = computed(() =>
      drillthroughContent.value.map((e) => {
        const result = {};
        columnsDesc.value.forEach((d) => {
          result[d.caption] = e[d.name];
        });
        return result;
      })
    );

    const { isOpened, run, close } = usePromisifiedModal(reset, opened);

    return {
      drillthroughContent,
      isOpened,
      run,
      close,
      reset,
      tableColumns,
      tableRows,
    };
  },
  methods: {
    ok() {
      this.close({});
    },
  },
};
</script>
<template>
  <va-modal
    :modelValue="isOpened"
    no-padding
    fixed-layout
    class="server-url-modal"
    @ok="ok"
  >
    <template #content="{ ok }">
      <va-card-title class="va-h6">Data returned for cell: </va-card-title>
      <va-card-content>
        <va-data-table
          loading
          sticky-header
          height="600px"
          virtual-scroller
          :columns="tableColumns"
          :items="tableRows"
        ></va-data-table>
      </va-card-content>
      <va-card-actions>
        <va-button @click="ok">Close</va-button>
      </va-card-actions>
    </template>
  </va-modal>
</template>
<style lang="scss">
.server-url-modal {
  .va-modal__inner > div {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .va-card__content {
    overflow-y: auto;
  }

  .va-card__actions {
    margin-top: 1rem;
  }

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
