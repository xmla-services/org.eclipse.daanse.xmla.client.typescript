<script setup lang="ts">
import TreeView from "./components/Tree/TreeView.vue";
import MainLayout from "./components/MainLayout.vue";
import QuertyDesignerLayout from "./components/QuertyDesignerLayout.vue";
import QuertyDesigner from "./components/QueryDesigner/QueryDesigner.vue";
import PivotTable from "./components/PivotTable/PivotTable.vue";

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
    <template #right_container> <PivotTable /> </template>
  </MainLayout>
</template>

<style scoped></style>
