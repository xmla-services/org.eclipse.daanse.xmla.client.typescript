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
import type XMLADatasource from "@/dataSources/XmlaDatasource";
import type { XMLAStore } from "@/stores/Widgets/XMLAStore";
import { ref, type Ref } from "vue";

// const url = "https://ssemenkoff.dev/emondrian/xmla";
export default {
  name: "AxisSelectionModal",
  setup() {
    const hierarchyList = ref([] as MDSchemaHierarchy[]);
    const selectedHierarchies = ref([] as MDSchemaHierarchy[]);

    const opened = async (data) => {
      const store = data.store as XMLAStore;
      const preselectedHierarchies = data.selectedHierarchies as MDSchemaHierarchy[];
      const dataSource = store.getDatasource() as XMLADatasource;

      const measures = await dataSource.getHierarchies();
      selectedHierarchies.value = preselectedHierarchies;

      console.log(measures);
      hierarchyList.value = measures;
    };

    const { isOpened, run, close } = usePromisifiedModal(() => {
      selectedHierarchies.value = [];
      hierarchyList.value = [];
    }, opened);

    return {
      isOpened,
      run,
      close,
      hierarchyList,
      selectedHierarchies,
    };
  },
  methods: {
    ok() {
      this.close(this.selectedHierarchies);
    },
  },
};
</script>
<template>
  <va-modal
    :modelValue="isOpened"
    no-padding
    class="modal"
    @ok="ok"
    zIndex="10000000"
  >
    <template #content="{ ok }">
      <va-card-title class="va-h6">Select measures</va-card-title>
      <va-card-content>
        <VaOptionList
          v-model="selectedHierarchies"
          :options="hierarchyList"
          track-by="HIERARCHY_UNIQUE_NAME"
          text-by="HIERARCHY_NAME"
          class="measure_list"
        />
      </va-card-content>
      <va-card-actions>
        <va-button @click="ok">Ok!</va-button>
      </va-card-actions>
    </template>
  </va-modal>
</template>
<style lang="scss" scoped>
.measure_list {
  padding: 20px 0;
}
</style>
