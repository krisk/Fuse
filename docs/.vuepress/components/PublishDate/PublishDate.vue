<template>
  <span class="publish-date">Published {{ formatted }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ date: string }>()

const formatted = new Date(props.date).toLocaleDateString('en-US', {
  month: 'long',
  year: 'numeric'
})
</script>

<style scoped>
.publish-date {
  color: var(--c-text-lightest);
  font-size: 0.85rem;
}
</style>
