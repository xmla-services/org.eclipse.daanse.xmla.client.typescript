<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts">


export default {
  setup() {

  },
  computed:{

  },
  watch:{

  },
  methods: {

  },
  components: {

  },
  mounted() {

  },
};
</script>
<template>
  <va-navbar color="primary" class="mb-3 high_index h-24" >
    <template #left>
      <va-navbar-item class="logo">
        <div class="white triangle"></div>
        <div class="small logo daanse" id="logo"></div>
        <div class="small logo daanse" id="claim"></div>
      </va-navbar-item>
    </template>


    <template>

    </template>
  </va-navbar>
</template>

<style lang="scss" scoped>
.high_index {
  z-index: 5;
  height: 64px;
  overflow: hidden;
  box-shadow: 0px 0px 9px 1px #33333359;
}
#logo {
  width: 66px;
  height: 97px;
  position: absolute;
  left: -10px;
  top: -50px;
  background-size: 138px;
  background-position: 0px;
}
#claim {
  width: 131px;
  height: 97px;
  position: absolute;
  left: 49px;
  top: -50px;
  background-size: 240px;
  background-position: -109px;
}
</style>
