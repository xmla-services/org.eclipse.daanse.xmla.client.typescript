<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
import TreeView from "./components/Tree/TreeView.vue";
import MainLayout from "./components/MainLayout.vue";
import QuertyDesignerLayout from "./components/QuertyDesignerLayout.vue";
import QuertyDesigner from "./components/QueryDesigner/QueryDesigner.vue";
import PivotTable from "./components/PivotTable/PivotTable.vue";
import Chart from "./components/Charts/Chart.vue";

console.log("https://ssemenkoff.dev/emondrian/xmla");
</script>

<template>
  <test></test>
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
      <QuertyDesignerLayout layout="vertical">
        <template #left_container>
          <PivotTable />
        </template>
        <template #right_container>
          <Chart />
        </template>
      </QuertyDesignerLayout>
    </template>
  </MainLayout>
</template>

<style scoped></style>
