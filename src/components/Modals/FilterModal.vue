<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts">
import { usePromisifiedModal } from "@/composables/promisifiedModal";
import { ref } from "vue";
import FilterTreeView from "../Filters/FilterTreeView.vue";

export default {
  name: "ServerSelectionModal",
  emits: ["setFilters"],
  setup() {
    const filterConfigured = ref({});
    const rootHierarchy = ref({});
    const reset = () => {
      filterConfigured.value = {};
    };
    const opened = ({ element }: { element: any }) => {
      rootHierarchy.value = {
        item: element.originalItem,
        filters: element.filters,
      };

      const initialFilters = element.filters;
      if (initialFilters.multipleChoise) {
        filterConfigured.value = {
          enabled: initialFilters.enabled,
          multipleChoise: initialFilters.multipleChoise,
          selectAll: initialFilters.selectAll,
          selectedItems: initialFilters.selectedItems,
          deselectedItems: initialFilters.deselectedItems,
        };
      } else {
        filterConfigured.value = {
          enabled: initialFilters.enabled,
          multipleChoise: initialFilters.multipleChoise,
          selectedItem: initialFilters.selectedItem,
        };
      }
    };
    const { isOpened, run, close } = usePromisifiedModal(reset, opened);

    const setSelection = ({
      enabled,
      multipleChoise,
      selectedItem,
      selectAll,
      selectedItems,
      deselectedItems,
    }: {
      enabled: boolean;
      multipleChoise: boolean;
      selectAll: boolean;
      selectedItem: any;
      selectedItems: any[];
      deselectedItems: any[];
    }) => {
      if (multipleChoise) {
        filterConfigured.value = {
          enabled,
          multipleChoise,
          selectAll,
          selectedItems,
          deselectedItems,
        };
      } else {
        filterConfigured.value = {
          enabled,
          multipleChoise,
          selectedItem,
        };
      }
    };

    return {
      filterConfigured,
      isOpened,
      run,
      close,
      rootHierarchy,
      setSelection,
    };
  },
  methods: {
    ok() {
      this.close({ filters: this.filterConfigured });
    },
  },
  components: { FilterTreeView },
};
</script>
<template>
  <va-modal
    :modelValue="isOpened"
    no-padding
    class="filter-modal"
    @ok="ok"
    fixed-layout
  >
    <template #content="{ ok }">
      <va-card-title class="va-h6">Enable any filters:</va-card-title>
      <va-card-content>
        <Suspense>
          <FilterTreeView
            :rootHierarchy="rootHierarchy"
            @set-selection="setSelection"
          ></FilterTreeView>
        </Suspense>
      </va-card-content>
      <va-card-actions>
        <va-button @click="ok" color="warning">Ok!</va-button>
      </va-card-actions>
    </template>
  </va-modal>
</template>
<style lang="scss">
.filter-modal {
  .va-modal--fixed-layout .va-modal__inner {
    height: calc(100vh - 2rem);
  }

  .va-modal__container {
    width: 100%;
  }

  .va-modal__dialog {
    margin: auto;
  }

  .va-modal__inner > div {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .va-card__content {
    overflow: hidden;
    display: flex;
    width: 100%;
    height: 100%;
  }

  .va-card__content > div {
    flex-direction: column;
    overflow: hidden;
    width: 100%;
  }
}
</style>
