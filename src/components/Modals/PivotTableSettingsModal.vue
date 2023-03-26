<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts">
import { usePromisifiedModal } from "@/composables/promisifiedModal";
import { usePivotTableStore } from "@/stores/PivotTable";
import { ref } from "vue";

export default {
  name: "PivotTableSettingsModal",
  setup() {
    const pivotTableStore = usePivotTableStore();
    const { isOpened, run, close } = usePromisifiedModal(() => {});

    const showEmpty = ref(pivotTableStore.state.settings.showEmpty);

    return {
      isOpened,
      run,
      close,
      showEmpty,
    };
  },
  methods: {
    ok() {
      this.close({
        showEmpty: this.showEmpty,
      });
    },
  },
};
</script>
<template>
  <va-modal :modelValue="isOpened" no-padding class="server-url-modal" @ok="ok">
    <template #content="{ ok }">
      <va-card-title class="va-h6">Pivot table settings</va-card-title>
      <va-card-content>
        <va-checkbox
          v-model="showEmpty"
          class="mb-6"
          label="Show empty rows/columns"
        />
      </va-card-content>
      <va-card-actions>
        <va-button @click="ok" >Save</va-button>
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
