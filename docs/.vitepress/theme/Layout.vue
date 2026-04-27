<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import CarbonAds from './components/CarbonAds.vue'
import Sponsors from './components/Sponsors.vue'
import SponsorBanner from './components/SponsorBanner.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top>
      <SponsorBanner />
    </template>
    <template #aside-outline-after>
      <Sponsors />
      <CarbonAds />
    </template>
  </Layout>
</template>
