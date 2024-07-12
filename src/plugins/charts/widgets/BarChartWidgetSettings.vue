<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import {ref, type Ref, onMounted, computed, unref, toRaw} from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";

import type { XMLAStore } from "@/stores/Widgets/XMLAStore";
import DataSetPropertyList from "@/plugins/charts/widgets/parts/DataSetPropertyList.vue";
import type {IDataSetSelector} from "@/plugins/charts/widgets/api/DataSetSelector";
import type {Composer, CSVSelector, Selector} from "@/plugins/charts/widgets/api/ChartdataComposer";
import {CSVComposer} from "@/plugins/charts/impl/CSVComposer";
import CSVComposerV from "@/plugins/charts/widgets/parts/CSVComposerV.vue";



export interface AxisSettings{

    type:string,
    align:string,
    color:string,
    padding:number

}
export interface ITChartSettings {
    baseMapUrl: string;
    dataSets:IDataSetSelector[];
    composer:Composer<Selector>[];
    axes:{
        x:AxisSettings,
        y:AxisSettings[]
    }
}


interface IChartComponent {
  store: Store | XMLAStore;
  settings: ITChartSettings;
  setSetting: (key: string, value: any) => void;
  setStore: (store: Store | XMLAStore) =>any;
}

const { component } = defineProps<{ component: IChartComponent }>();

const opened = ref({
  mapSection: false,
  storeSection: false,
  RenderSection:false,
});

// TODO: Move to store selection component
const storeManager = useStoreManager();




const requestResult = ref("");

const getStores = computed(() => {
    const storeList = storeManager.getStoreList();
    return Array.from(storeList.value.values());
});




const addComposer=(store:IStore)=>{
    console.log('add ')
    const storeData = component.setStore(store as Store);
    const csvComposer = new CSVComposer();

    csvComposer.setStore(storeData.store);
    csvComposer.setData(storeData.data);

    csvComposer.setSelectorX({
        header:'item'
    }as CSVSelector)
    csvComposer.addSelectorY({
        header:'markets'
    }as CSVSelector)
    /*csvComposer.addSelectorY({
        header:'bj'
    }as CSVSelector)*/

   const val = [...toRaw(unref(component.settings.composer))];
    val.push(csvComposer)
    //console.log(component.settings.composer.push(2));
    component.setSetting('composer',val);
    //component.settings.composer.push(csvComposer);
    /*let list = component.settings.composer;
    list.push(csvComposer)*/

}

onMounted(() => {

});
</script>

<template>
  <va-collapse v-model="opened.mapSection" header="Axes">
    <div class="settings-container">

      <div class="settings-block">

          x-Axis:

          <VaSelect
              v-if="component.settings.axes.x"
              :model-value="component.settings.axes.x.type"
              @update:modelValue="ev=>component.setSetting('axes.x.type',ev)"
              :options="['time','linear','logarithmic','category']"
              placeholder="Select an header for X"
          />
          <VaSelect
              v-model="align"
              :options="['start','center','end']"
              placeholder="Select an header for X"
          />
          <VaColorInput
              v-model="color">
          </VaColorInput>
          <VaInput
              v-model="padding"
          label="padding">

          </VaInput>


          y-Axis:


      </div>
    </div>
  </va-collapse>
  <va-collapse v-model="opened.RenderSection" header="Data">
    <div class="settings-container">

      <div class="settings-block">

          <!--<DataSetPropertyList  :model-value="component.settings.dataSets" @update:model-value="value => component.setSetting('dataSets',value)"></DataSetPropertyList>-->
          <VaDropdown>
              <template #anchor>
                  <VaButton> Add+  </VaButton>
              </template>

              <VaDropdownContent>
              <VaList>
                  <VaListItem v-for="store in getStores" @click="addComposer(store)">
                      {{store.caption}}
                  </VaListItem>

              </VaList>
              </VaDropdownContent>
          </VaDropdown>

      </div>

      <div class="composers" v-for="(composer, i) in component.settings.composer">
            <CSVComposerV :modelValue="component.settings.composer[i]"></CSVComposerV>
      </div>

    </div>
  </va-collapse>
</template>
<style lang="scss" scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}

.settings-block {
  display: flex;
  flex-direction: column;
}

.text-title {
  width: 100%;
}

.text-size {
  width: 63px;
  margin-left: 12px;
}

.text-color {
  width: 156px;
}

.text-weight {
  width: 100px;
}

.align-buttons-group {
  display: flex;
  align-items: flex-end;

  .button-group {
    padding: 2px;
  }

  .align-button {

    &:hover  {
      --va-background-color: rgb(162, 181, 218) !important;
    }

    &:nth-child(4) {
      // padding-left: 10px;
    }
  }
}
</style>
