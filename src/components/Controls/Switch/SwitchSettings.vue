<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
export interface ISwitchSettings {
    label: string;
    availableEvents: string[];
    events: EventItem[];
}

export interface ISwitchComponent {
    settings: ISwitchSettings;
    setSetting: (key: string, value: any) => void;
}

import { useI18n } from "vue-i18n";
import type { EventItem } from "@/@types/controls";
import { ref, type Ref } from "vue";

const { t } = useI18n();
const { component } = defineProps<{ component: ISwitchComponent }>();

const options: Ref<string[]> = ref(component.settings.availableEvents);
const events: Ref<EventItem[]> = ref(component.settings.events);

const addEvent = () => {
    const events = component.settings.events;

    events.push({
        name: "",
        trigger: "",
    });
};

const deleteEvent = (id: number) => {
    const events = component.settings.events;
    events.splice(id, 1);
};
</script>

<template>
    <va-input
        class="event-input"
        :model-value="component.settings.label"
        label="Label text"
        @update:model-value="component.setSetting('label', $event)"
    />
    <div class="events-list">
        <div class="events-list-label">
            <h3>{{ t("Controls.eventsList") }}</h3>
            <va-button @click="addEvent">{{
                t("Controls.addButton")
            }}</va-button>
        </div>
        <div class="events-list-content">
            <va-data-table
                class="table-crud"
                :items="events"
                :columns="[
                    { key: 'name' },
                    { key: 'trigger' },
                    { key: 'actions' },
                ]"
            >
                <template #cell(name)="{ rowIndex }">
                    <va-input
                        class="name-input"
                        v-model="events[rowIndex].name"
                        @update:model-value="
                            component.setSetting('name', $event)
                        "
                    >
                    </va-input>
                </template>
                <template #cell(trigger)="{ rowIndex }">
                    <va-select
                        class="trigger-input"
                        v-model="events[rowIndex].trigger"
                        :options="options"
                        @update:model-value="
                            component.setSetting('trigger', $event)
                        "
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
