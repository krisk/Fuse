<template>
  <Suspense>
    <Demo />
    <template #fallback>Loading demo...</template>
  </Suspense>
</template>

<script setup lang="ts">
import Demo from '../Demo/Demo.vue'
</script>
