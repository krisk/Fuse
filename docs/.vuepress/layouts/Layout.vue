<template>
  <ParentLayout>
    <template #sidebar-top>
      <Suspense>
        <CarbonAds />
        <template #fallback>Loading ads...</template>
      </Suspense>
    </template>
  </ParentLayout>
</template>

<script setup>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import CarbonAds from './components/CarbonAds.vue'
</script>
