<script lang="ts" setup>
const props = defineProps(["component"]) as any;
</script>

<template>
  <va-input v-model="props.component.text" label="Text" />
  <va-input v-model="props.component.fontSize" label="Font Size" />
  <va-input v-model="props.component.fontColor" label="Font Color" />
  <va-input v-model="props.component.textAlign" label="Text Align" />
  <va-input v-model="props.component.fontWeight" label="Font Weight" />
</template>
