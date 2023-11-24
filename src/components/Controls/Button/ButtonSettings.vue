<script lang="ts" setup>
const props = defineProps(["component"]) as any;
const options = props.component.availableEvents;
let events = props.component.events;

const addEvent = () => {
  events.push({
    name: "",
    trigger: "",
  });
};

const deleteEvent = (id) => {
  props.component.events = [...events.slice(0, id), ...events.slice(id + 1)];
  events = props.component.events;
};
</script>

<template>
  <va-input
    class="event-input"
    v-model="props.component.title"
    label="Button text"
  />
  <div class="events-list">
    <div class="events-list-title">
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
<style>
.events-list {
  margin-top: 20px;
}

.events-list-title {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
}

.events-list-title > h3 {
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
