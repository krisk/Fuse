<template>
  <ParentLayout>
    <!-- <template #sidebar-top>
      <Version />
    </template> -->
    <template #sidebar-top>
      <CarbonAds />
    </template>
    <template #page-bottom>
      <BuySellAds />
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import CarbonAds from '@theme/components/CarbonAds.vue'
import BuySellAds from '@theme/components/BuySellAds.vue'
// import Version from '@theme/components/Version.vue'

export default {
  name: 'Layout',
  components: {
    ParentLayout,
    // Version
    CarbonAds,
    BuySellAds
  }
}
</script>
