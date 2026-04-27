<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import CarbonAds from './components/CarbonAds.vue'
import Sponsors from './components/Sponsors.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #aside-outline-after>
      <Sponsors />
      <CarbonAds />
    </template>
  </Layout>
</template>
