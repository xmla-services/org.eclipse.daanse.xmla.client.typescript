<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
const props = defineProps(["component"]);
</script>

<template>
  <div class="sidebar-settings">
    <div class="sidebar-settings-title">
      <h2 class="mb-2">Control settings</h2>
    </div>
    <div class="sidebar-settings-content">
      <component
        :is="props.component.settings"
        :component="props.component"
      ></component>
    </div>
  </div>
</template>

<style lang="css">
.sidebar-settings {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 10px;
  width: 100%;
}

.sidebar-settings-title {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.sidebar-settings-title > h2 {
  font-size: 24px;
  flex-grow: 1;
}

.sidebar-settings-content {
  width: 100%;
  margin-top: 20px;
}
</style>
