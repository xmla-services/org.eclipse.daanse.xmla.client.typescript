<template>
  <div class="split-container">
    <va-split
      class="split"
      :model-value="30"
      :limits="[
        ['300px', 'any'],
        ['200px', 'any'],
      ]"
    >
      <template #start>
        <div class="section-block">
          <slot name="left_container" />
        </div>
      </template>
      <template #end>
        <div class="section-block">
          <slot name="right_container" />
        </div>
      </template>
    </va-split>
  </div>
</template>

<style lang="scss" scoped>
.app-layout-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.split-container {
  height: 100%;
  overflow: hidden;
}

.split {
  height: 100%;
  width: 100%;

  & .section-block {
    position: relative;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    user-select: none;
  }
}
</style>
