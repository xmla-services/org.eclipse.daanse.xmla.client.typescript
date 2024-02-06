<script lang="ts" setup>
import { ref ,onMounted, Ref} from "vue";
import {useStoreManager} from "@/composables/storeManager";
import {Store} from "@/stores/Widgets/Store";

const props = defineProps(["component"]) as any;
const opened = ref({
  textSection: false,
  storeSection: false,
});
const storeManager = useStoreManager();
const stores = ref([]) as Ref<any[]>;
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
  <va-collapse v-model="opened.textSection" header="SVG  widget settings">
    <div class="settings-container">
      <va-input v-model="props.component.src" label="src"/>
      <va-input v-model="props.component.repeations" label="repeations"/>
      <va-input v-model="props.component.progress" label="progress"/>
      <div class="colors">
        <va-color-input
          class="color-input"
          v-model="props.component.activeItemStyles.fill"
          label="Active item fill"
        />
        <va-color-input
          class="color-input"
          v-model="props.component.activeItemStyles.stroke"
          label="Active item stroke"
        />
      </div>
      <div class="colors">
        <va-color-input
          class="color-input"
          v-model="props.component.defaultItemStyles.fill"
          label="Default item fill"
        />
        <va-color-input
          class="color-input"
          v-model="props.component.defaultItemStyles.stroke"
          label="Default item stroke"
        />
      </div>
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
.colors {
  display: flex;
  justify-content: space-between;
}
.color-input {
  width: 49%;
}
</style>
