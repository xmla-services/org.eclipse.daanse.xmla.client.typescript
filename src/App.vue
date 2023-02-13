<script setup lang="ts">
import TreeView from "./components/Tree/TreeView.vue";
import MainLayout from "./components/MainLayout.vue";
import QuertyDesignerLayout from "./components/QuertyDesignerLayout.vue";
import QuertyDesigner from "./components/QueryDesigner/QueryDesigner.vue";

console.log("https://ssemenkoff.dev/emondrian/xmla");
</script>

<template>
  <MainLayout>
    <template #left_container>
      <QuertyDesignerLayout>
        <template #left_container>
          <TreeView />
        </template>
        <template #right_container> <QuertyDesigner /> </template>
      </QuertyDesignerLayout>
    </template>
    <template #right_container> Pivot table </template>
  </MainLayout>
</template>

<style scoped></style>
