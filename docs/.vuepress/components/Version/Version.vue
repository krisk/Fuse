<template>
  Latest stable version: <span class="bold">{{ version }}</span>
</template>

<script setup lang="ts">
import { useThemeData } from '@vuepress/plugin-theme-data/client'
import { ref } from 'vue'

const themeData = useThemeData()

const version = ref(themeData.value.version)
</script>

<style scoped>
.bold {
  font-weight: bolder;
}
</style>
