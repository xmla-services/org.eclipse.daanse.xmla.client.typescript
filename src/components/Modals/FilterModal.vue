<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts">
import { usePromisifiedModal } from "@/composables/promisifiedModal";
import { ref } from "vue";

export default {
  name: "ServerSelectionModal",
  setup() {
    const filterConfigured = ref(false);
    const reset = () => {
      filterConfigured.value = false;
    };

    const opened = ({ filters }: { filters: any }) => {
      console.log(filters);
      filterConfigured.value = filters.enabled;
    };

    const { isOpened, run, close } = usePromisifiedModal(reset, opened);

    return {
      filterConfigured,
      isOpened,
      run,
      close,
    };
  },
  methods: {
    ok() {
      this.close({ enabled: this.filterConfigured });
    },
  },
};
</script>
<template>
  <va-modal :modelValue="isOpened" no-padding class="server-url-modal" @ok="ok">
    <template #content="{ ok }">
      <va-card-title class="va-h6">Enable any filters:</va-card-title>
      <va-card-content>
        <va-checkbox v-model="filterConfigured" label="Enable filters" />
      </va-card-content>
      <va-card-actions>
        <va-button @click="ok" color="warning">Ok!</va-button>
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
