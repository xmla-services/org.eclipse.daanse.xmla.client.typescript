<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts">
import {OptionalSelects, useAppSettingsStore, ViewOptions} from "@/stores/AppSettings";
import ServerSelectionModal from "@/components/Modals/ServerSelectionModal.vue";
import CatalogSelectionModal from "@/components/Modals/CatalogSelectionModal.vue";
import PivotTableSettingsButton from "@/components/PivotTable/PivotTableSettingsButton.vue";
import { useLocationManager } from "@/composables/locationManager";
import {ref} from "vue";

// const url = "https://ssemenkoff.dev/emondrian/xmla";
const locationManager = useLocationManager();

export default {
  setup() {
    const store = useAppSettingsStore();

    const uri = locationManager.queryState.value.datasourceUrl;
    const cube = locationManager.queryState.value.cube;
    const catalog = locationManager.queryState.value.catalog;

    const viewOption = store.viewOption;
    const optionsSwitch = store.optionalSelect;

    const optionsSwitchoptions = ref([
      { icon: 'insert_chart', value: OptionalSelects.CHART },
      { icon: 'map', value: OptionalSelects.MAP },

    ]);

    return {
      store,
      uri,
      cube,
      catalog,
      viewOption,
      optionsSwitch,
      optionsSwitchoptions
    };
  },
  computed:{
    viewOptionoptions(){

      if(this.store.optionalSelect == OptionalSelects.MAP){
        return [
          { icon: 'table_chart', value: ViewOptions.TABLE },
          { "icon":'table_chart',"iconRight":'map',label:'/', value:  ViewOptions.SPLIT},
          { icon: 'map', value: ViewOptions.OPTIONAL },

        ];
      }
      else{
        return [
          { icon: 'table_chart', value: ViewOptions.TABLE },
          { "icon":'table_chart',"iconRight":'insert_chart',label:'/', value: ViewOptions.SPLIT},
          { icon: 'insert_chart', value: ViewOptions.OPTIONAL },

        ];
      }
    }
  },
  watch:{
    viewOption(val){
      this.store.switchViewOption(val)
    },
    optionsSwitch(val){
      this.store.switchOptional(val)
    }
  },
  methods: {
    async connect() {
      const serverSelectionModal: any = this.$refs.serverSelectionModal;
      const catalogSelectionModal: any = this.$refs.catalogSelectionModal;

      let url = null as string | null;

      if (this.uri) {
        url = this.uri;
      } else {
        url = (await serverSelectionModal.run()) as string;
      }
      locationManager.queryState.value.datasourceUrl = url;
      await this.store.initXmlaApi(url);

      let cube = null as string | null,
        catalog = null as string | null;

      if (this.cube && this.catalog) {
        cube = this.cube;
        catalog = this.catalog;
      } else {
        const catalogSelectionResult = (await catalogSelectionModal.run()) as {
          cube: string;
          catalog: string;
        };

        cube = catalogSelectionResult.cube;
        catalog = catalogSelectionResult.catalog;
      }
      locationManager.queryState.value.cube = cube;
      locationManager.queryState.value.catalog = catalog;

      await this.store.openCube(catalog, cube);
    },
  },
  components: {
    ServerSelectionModal,
    CatalogSelectionModal,
    PivotTableSettingsButton,
  },
  mounted() {
    if (this.uri) {
      this.connect();
    }
  },
};
</script>
<template>
  <va-navbar color="primary" class="mb-3 high_index">
    <template #left>
      <va-navbar-item class="logo">
        <div class="white triangle"></div>
        <div class="small logo daanse" id="logo"></div>
        <div class="small logo daanse" id="claim"></div>
      </va-navbar-item>
    </template>
    <template #right>
      <va-navbar-item v-if="!store.xmlaApiInited">
        <va-button @click="connect">Connect</va-button>
      </va-navbar-item>
      <va-navbar-item v-if="store.xmlaApiInited">
        <va-button-toggle
            v-model="store.viewOption"
            :options="viewOptionoptions"
        />
      </va-navbar-item>
      <va-navbar-item v-if="store.xmlaApiInited">
        <va-button-toggle
            v-model="store.optionalSelect"
            :options="optionsSwitchoptions"
        />
      </va-navbar-item>
      <va-navbar-item>
        <PivotTableSettingsButton />
      </va-navbar-item>

    </template>

    <Teleport to="body">
      <ServerSelectionModal ref="serverSelectionModal" />
      <CatalogSelectionModal ref="catalogSelectionModal" />
    </Teleport>
  </va-navbar>
</template>

<style lang="scss" scoped>
.high_index {
  z-index: 5;
  overflow: hidden;
  box-shadow: 0px 0px 9px 1px #33333359;
}
#logo {
  width: 66px;
  height: 97px;
  position: absolute;
  left: -10px;
  top: -50px;
  background-size: 138px;
  background-position: 0px;
}
#claim {
  width: 131px;
  height: 97px;
  position: absolute;
  left: 49px;
  top: -50px;
  background-size: 240px;
  background-position: -109px;
}
</style>
