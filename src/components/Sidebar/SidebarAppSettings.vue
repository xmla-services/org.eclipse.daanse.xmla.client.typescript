<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { ref, type Ref, inject, computed } from 'vue';

const innerBackground = inject('backgroundColor') as string;
const isDarkTheme: Ref<boolean> = ref(JSON.parse(localStorage.getItem('isDarkTheme')) || false);

const setTheme = () => {
  localStorage.setItem('isDarkTheme', JSON.stringify(isDarkTheme.value));
  const htmlElement = document.documentElement;
  htmlElement.classList.toggle('light-theme');
  htmlElement.classList.toggle('dark-theme');
};

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  setTheme();
};

</script>

<template>
  <div class="app-settings">
    <div class="app-settings-title">
      <h2>App settings</h2>
      <va-color-input
        v-model="innerBackground"
        label="Background color"
        clearable
      />
      <div class="switch-theme mt-4">
        <va-switch
          v-model="isDarkTheme"
          @click="toggleTheme"
          off-color="#ffd300"
          style="--va-switch-checker-background-color: #252723;"
        >
          <template #innerLabel>
            <div class="va-text-center">
              <VaIcon
                :name="isDarkTheme ? 'dark_mode' : 'light_mode'"
              />
            </div>
          </template>
        </va-switch>
        <span class="ml-3">Switch theme</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-settings {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 32px;
  width: 100%;
}

.app-settings-title {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.app-settings-title > h2 {
  font-size: 24px;
  flex-grow: 1;
  margin-bottom: 32px;
}

.switch-theme {
  display: flex;
  width: auto;

  span {
    display: flex;
    align-items: center;
  }
}
</style>
