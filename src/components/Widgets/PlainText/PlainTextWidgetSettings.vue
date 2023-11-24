<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";

const props = defineProps(["component"]) as any;
const options = ref([]) as Ref<any[]>;
const requestResult = ref("");
const field = ref(props.component.objectField);
const storeId = ref(props.component.storeId);
const storeManager = useStoreManager();
let stores = ref([]) as Ref<any[]>;

const getData = async () => {
  const store = storeManager.getStore(storeId.value) as Store;

  const data = await store.getData();
  requestResult.value = JSON.stringify(data, null, 2);
  options.value = Object.keys(data);
};

const getStores = () => {
  const storeList = storeManager.getStoreList();

  stores.value = Array.from(storeList.value, function (entry) {
    return { ...entry[1] };
  });
};

const updateStore = (store) => {
  storeId.value = store;
  props.component.setSettings({
    store: store,
  });
  getData();
};

const updateField = (fieldVal) => {
  field.value = fieldVal;

  props.component.setSettings({
    field: field.value,
  });
};

onMounted(() => {
  getStores();
  if (storeId.value) {
    getData();
  }
});
</script>

<template>
  <div class="mt-4 mb-4">
    <h3 class="mb-2">Select store</h3>
    <div v-for="store in stores" :key="store.id">
      <va-radio
        :model-value="storeId"
        @update:model-value="updateStore"
        :option="{
          text: `${store.caption} ${store.id}`,
          id: store.id,
        }"
        value-by="id"
        name="store-radio-group"
      />
    </div>
  </div>
  <div>
    <va-select
      class="mb-2 input"
      :model-value="field"
      @update:model-value="updateField"
      :options="options"
      placeholder="Select field"
      label="Select field to be displayed in widget"
    />
    <pre class="response">{{ requestResult }}</pre>
  </div>
</template>
<style>
.response {
  background-color: lightgrey;
  padding: 0.5rem;
  border-radius: 4px;
}
</style>
