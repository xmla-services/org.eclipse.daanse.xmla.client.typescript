<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps(["layout","max","min"]);
const split = computed(() => {
  if(props.max)
    return 100
  if(props.min)
    return 0
  return undefined
})

</script>
<template>
  <div class="split-container">
    <template v-if="props.layout === 'default'">
      <va-split
        class="split"
        :model-value="30"
        :limits="[
          ['300px', 'any'],
          ['300px', 'any'],
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
    </template>
    <template v-if="props.layout === 'vertical'">
      <va-split class="split vertical" vertical :model-value="split">
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
    </template>
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
