<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { useDatasourceManager } from "../../composables/datasourceManager";
import { ref, watch } from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const items = ref(["Item 1", "Item 2", "Item 3", "Item 4"]);

const dsManager = useDatasourceManager();
const map = dsManager.getDatasourceList();
const list = ref([]);

watch(
  map,
  () => {
    list.value = Array.from(map.value, function (entry) {
      return entry[1];
    });
  },
  { deep: true },
);
</script>

<template>
  <va-list>
    <va-list-label>{{ t('DataSource.dataSource') }}</va-list-label>
    <template v-if="list.length">
      <va-list-item
        v-for="(item, index) in list"
        :key="index"
        class="list__item"
      >
        <va-list-item-section>
          <va-list-item-label>
            {{ item.type }}
          </va-list-item-label>
          <va-list-item-label>
            {{ item.url }}
          </va-list-item-label>
        </va-list-item-section>
      </va-list-item>
    </template>
    <template v-else>{{ t('DataSource.withoutDataSource') }}</template>
  </va-list>
</template>

<style scoped>
.list__item {
  padding: 0.5rem;
  border: 1px solid silver;
}
</style>
