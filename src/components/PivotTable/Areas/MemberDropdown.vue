<script setup lang="ts">
import type { TinyEmitter } from "tiny-emitter";
import { inject, ref, watch } from "vue";

defineEmits(["drilldown", "drillup"]);
defineProps(["drillupDisabled"]);

const opened = ref(false);
const eventBus = inject("eventBus") as TinyEmitter;
const uid = "id" + Math.random().toString(16).slice(2);

eventBus.on("DropdownOpened", (openedUid: string) => {
  if (uid === openedUid) return;
  opened.value = false;
});

watch(opened, () => {
  if (opened.value) {
    eventBus.emit("DropdownOpened", uid);
  }
});
</script>
<template>
  <va-dropdown
    prevent-overflow
    v-model="opened"
    placement="bottom-start"
    trigger="right-click"
    keep-anchor-width
    :offset="[-5, 10]"
  >
    <template #anchor>
      <slot></slot>
    </template>

    <va-dropdown-content style="padding: 0; margin: 0">
      <va-button-group class="dropdown_button-group">
        <va-button
          preset="plain"
          class="dropdown_button"
          text-color="#000"
          :hover-opacity="0.5"
          @click="$emit('drilldown')"
        >
          Drilldown
        </va-button>
        <va-button
          v-if="!drillupDisabled"
          preset="plain"
          class="dropdown_button"
          text-color="#000"
          :hover-opacity="0.5"
          @click="$emit('drillup')"
        >
          Drillup
        </va-button>
      </va-button-group>
    </va-dropdown-content>
  </va-dropdown>
</template>
<style scoped>
.dropdown_button-group {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  width: 100%;
}

.dropdown_button {
  text-align: left;
  justify-content: flex-start;
  border: 1px solid silver !important;
  border-bottom: 0 !important;
  border-radius: 0 !important;
  padding: 0.25rem !important;
}

.dropdown_button:last-child {
  border-bottom: 1px solid silver !important;
}
</style>
