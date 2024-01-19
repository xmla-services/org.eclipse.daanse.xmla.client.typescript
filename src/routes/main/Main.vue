<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<template>
  <InfoBox v-if="showInfoBox" :infoUri="infoUri || ''"></InfoBox>
  <MainLayout>
    <template #left_container>
      <QuertyDesignerLayout layout="vertical">
        <template #left_container>
          <TreeView />
        </template>
        <template #right_container> <QuertyDesigner /> </template>
      </QuertyDesignerLayout>
    </template>
    <template #right_container>
      <QuertyDesignerLayout layout="vertical" :max="appSettings.viewOption === viewOptionEnum.TABLE" :min="appSettings.viewOption === viewOptionEnum.OPTIONAL">
        <template #left_container>
          <PivotTable />
        </template>
        <template #right_container>
          <Chart v-if="(appSettings.viewOption === viewOptionEnum.SPLIT || appSettings.viewOption === viewOptionEnum.OPTIONAL)
                        && appSettings.optionalSelect === optionalSelectsEnum.CHART
                      "/>
          <Map v-if="(appSettings.viewOption === viewOptionEnum.SPLIT || appSettings.viewOption === viewOptionEnum.OPTIONAL)
                        && appSettings.optionalSelect === optionalSelectsEnum.MAP
                      "/>
        </template>
      </QuertyDesignerLayout>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import TreeView from "@/components/Tree/TreeView.vue";
import MainLayout from "@/components/MainLayout.vue";
import QuertyDesignerLayout from "@/components/QuertyDesignerLayout.vue";
import QuertyDesigner from "@/components/QueryDesigner/QueryDesigner.vue";
import PivotTable from "@/components/PivotTable/PivotTable.vue";
import Chart from "@/components/Charts/ChartModule.vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import InfoBox from "@/components/Modals/InfoBox.vue";
import Map from "@/components/Map/Map.vue"
import {OptionalSelects, useAppSettingsStore, ViewOptions} from "@/stores/AppSettings";

console.log("https://ssemenkoff.dev/emondrian/xmla");

const showInfoBox = ref(false);
const infoUri = ref(null);
const appSettings = useAppSettingsStore();
const viewOptionEnum = ViewOptions;
const optionalSelectsEnum = OptionalSelects;

onMounted(async () => {
  try {
    const base = window.location.protocol + "//" + window.location.host;
    const config = (await axios.get(`config/config.json`)).data;
    if (config && config.INFO_CHECK_URI && config.INFO_CHECK_URI) {
      infoUri.value = config.INFO_BASE_URI;
      showInfoBox.value =
          (await axios.get(config.INFO_CHECK_URI)).status == 200;
    }
  } catch (e) {
    console.log(e);
  }
});
</script>

<style scoped>

</style>
