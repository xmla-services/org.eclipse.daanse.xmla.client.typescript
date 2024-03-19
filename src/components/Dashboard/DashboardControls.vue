<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<template>
  <div class="controls-container">
    <va-button icon="settings" size="small" @click="$emit('openSettings')" />
    <va-button icon="clear" color="danger" size="small" @click="$emit('deleteWidget')" />
  </div>
</template>
<style>
.controls-container {
  position: absolute;
  top: -23px;
  right: 0;
  height: 40px;
}
</style>
