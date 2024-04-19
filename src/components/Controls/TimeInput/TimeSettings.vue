<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import type { ComponentProps, EventItem } from "@/@types/controls";
import { ref, type Ref } from "vue";

const props = defineProps(["component"]) as ComponentProps;
const options: Ref<string[]> = ref(props.component.availableEvents);
const events: Ref<EventItem[]> = ref(props.component.events);

const addEvent = () => {
  events.value.push({
    name: "",
    trigger: "",
  });
};

const deleteEvent = (id: number) => {
  events.value.splice(id, 1)
};
</script>

<template>
  <va-input
    class="event-input"
    v-model="props.component.label"
    label="Label text"
  />
  <div class="events-list">
    <div class="events-list-label">
      <h3>Events list</h3>
      <va-button @click="addEvent">Add</va-button>
    </div>
    <div class="events-list-content">
      <va-data-table
        class="table-crud"
        :items="events"
        :columns="[{ key: 'name' }, { key: 'trigger' }, { key: 'actions' }]"
      >
        <template #cell(name)="{ rowIndex }">
          <va-input class="name-input" v-model="events[rowIndex].name">
          </va-input>
        </template>
        <template #cell(trigger)="{ rowIndex }">
          <va-select
            class="trigger-input"
            v-model="events[rowIndex].trigger"
            :options="options"
          />
        </template>
        <template #cell(actions)="{ rowIndex }">
          <va-button
            preset="plain"
            icon="delete"
            @click="deleteEvent(rowIndex)"
          />
        </template>
      </va-data-table>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.options-list {
  display: flex;
  align-items: center;
  margin-left: 10px;

  button {
    margin: 14px 0 0 15px;
  }
}

.events-list {
  margin-top: 20px;
}

.events-list-label {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
}

.events-list-label > h3 {
  margin-bottom: 8px;
  font-size: 20px;
}

.name-input {
  width: 230px;
}

.trigger-input {
  width: 150px;
}

.event-input {
  width: 100%;
}
</style>
