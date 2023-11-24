<script lang="ts" setup>
const props = defineProps(["component"]) as any;
</script>

<template>
  <va-input v-model="props.component.imgSrc" label="Image src" />
</template>
