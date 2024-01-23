<script lang="ts" setup>
import { ref, type Ref, onMounted } from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";

const props = defineProps(["component"]) as any;
const opened = ref({
  textSection: false,
  storeSection: false,
});

const storeManager = useStoreManager();
let stores = ref([]) as Ref<any[]>;
const requestResult = ref("");
const storeId = ref(props.component.storeId);

const getStores = () => {
  const storeList = storeManager.getStoreList();

  stores.value = Array.from(storeList.value, function (entry) {
    return { ...entry[1] };
  });
};

const getData = async () => {
  const store = storeManager.getStore(storeId.value) as Store;

  const data = await store.getData();
  requestResult.value = JSON.stringify(data, null, 2);
};

const updateStore = (store) => {
  storeId.value = store;
  props.component.storeId = store;
  // props.component.setSettings({
  //   store: store,
  // });
  getData();
};

onMounted(() => {
  getStores();
  if (storeId.value) {
    getData();
  }
});
</script>

<template>
  <va-collapse v-model="opened.textSection" header="Text widget settings">
    <div class="settings-container">
      <va-input v-model="props.component.text" label="Text" />
      <va-input v-model="props.component.fontSize" label="Font Size" />
      <va-input v-model="props.component.fontColor" label="Font Color" />
      <va-input v-model="props.component.fontWeight" label="Font Weight" />
      <va-select
        v-model="props.component.textDecoration"
        label="Text decoration"
        :options="[
          'Underline solid',
          'Underline dashed',
          'Underline wavy',
          'Line-through',
          'Overline',
          'None',
        ]"
      />
      <va-select
        v-model="props.component.horizontalAlign"
        label="Horizontal align"
        :options="['Left', 'Center', 'Right']"
      />
      <va-select
        v-model="props.component.verticalAlign"
        label="Vertical align"
        :options="['Top', 'Center', 'Bottom']"
      />
    </div>
  </va-collapse>
  <va-collapse v-model="opened.storeSection" header="Store settings">
    <div class="settings-container">
      <div>
        <h3 class="mb-2">Select store</h3>
        <div class="mb-2" v-for="store in stores" :key="store.id">
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
        <pre class="response">{{ requestResult }}</pre>
      </div>
    </div>
  </va-collapse>
</template>
<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}
</style>
