<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts">
import { usePivotTableStore } from "@/stores/PivotTable";
import PivotTableSettingsModal from "@/components/Modals/PivotTableSettingsModal.vue";

export default {
  setup() {
    const pivotTableStore = usePivotTableStore();
    return {
      pivotTableStore,
    };
  },
  methods: {
    async openPivotTableSettings() {
      const pivotTableSettingsModal: any = this.$refs.pivotTableSettingsModal;
      const { showEmpty, alignContent } = await pivotTableSettingsModal.run();

      this.pivotTableStore.state.settings.showEmpty = showEmpty;
      this.pivotTableStore.state.settings.alignContent = alignContent;
    },
  },
  components: {
    PivotTableSettingsModal,
  },
};
</script>
<template>
  <va-button
    v-if="pivotTableStore.state.inited"
    icon="settings"
    color="secondary"
    preset="secondary"
    @click="openPivotTableSettings"
  />
  <Teleport to="body">
    <PivotTableSettingsModal ref="pivotTableSettingsModal" />
  </Teleport>
</template>
