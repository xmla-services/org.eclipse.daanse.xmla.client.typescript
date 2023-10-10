<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">

</script>

<template>
  <div class="sidebar">
    <va-sidebar
        hoverable
        minimized-width="55px"
        color="#fefefe"
        class="colored-sidebar"
    >
      <va-sidebar-item :active="$route.name==='designer'" @click="$router.push('/')" class="pointer">
        <va-sidebar-item-content  >
          <va-icon name="draw" :color="($route.name==='designer')?'#ffffff':'primary'"/>
          <va-sidebar-item-title>
            Designer
          </va-sidebar-item-title>
        </va-sidebar-item-content>
      </va-sidebar-item>
      <va-sidebar-item :active="$route.name==='dashboard'" @click="$router.push('/dashboard')" class="pointer">
      <va-sidebar-item-content >
        <va-icon name="dashboard" :color="($route.name==='dashboard')?'#ffffff':'primary'"/>
        <va-sidebar-item-title >
          Dashboard
        </va-sidebar-item-title>
      </va-sidebar-item-content>
      </va-sidebar-item>
    </va-sidebar>
  </div>

  <router-view>

  </router-view>
</template>

<style scoped>
.sidebar{
  position: absolute;
  left: 0;
  top: 63px;
  bottom: 0;
  z-index: 5;
  box-shadow: 0px -1px 6px 1px #00000014;
}
.pointer{
  cursor:pointer;
}

</style>
