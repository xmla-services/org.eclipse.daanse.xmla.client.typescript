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
      const { showEmpty } = await pivotTableSettingsModal.run();
      this.pivotTableStore.state.settings.showEmpty = showEmpty;
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
    @click="openPivotTableSettings"
  />
  <Teleport to="body">
    <PivotTableSettingsModal ref="pivotTableSettingsModal" />
  </Teleport>
</template>
