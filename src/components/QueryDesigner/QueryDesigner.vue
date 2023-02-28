<script lang="ts">
export default {};
</script>

<template>
  <div class="queryDesigner">
    <div class="queryDesignerArea">
      <div class="va-title">Filters</div>
      <div class="queryDesingnerArea_container"></div>
    </div>
    <div class="queryDesignerArea">
      <div class="va-title">Rows</div>
      <div class="queryDesingnerArea_container"></div>
    </div>
    <div class="queryDesignerArea">
      <div class="va-title">Columns</div>
      <div class="queryDesingnerArea_container"></div>
    </div>
    <div class="queryDesignerArea">
      <div class="va-title">Data</div>
      <div class="queryDesingnerArea_container"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.queryDesigner {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  padding: 1rem;

  .queryDesignerArea {
    display: flex;
    flex-direction: column;

    height: 100%;

    .queryDesingnerArea_container {
      height: 100%;
      width: 100%;

      border: 1px solid #9ea3ac;
      margin: 0.25rem 0 1rem;
    }
  }
}
</style>
