<template>
  <ParentLayout>
    <!-- <template #sidebar-top>
      <Version />
    </template> -->
    <template #sidebar-top>
      <CarbonAds />
      <!-- <div>
        <ins
          class="adsbygoogle"
          style="display: block; text-align: center;"
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-3734944050099256"
          data-ad-slot="8461402236"
        ></ins>
        <script>
          ;(adsbygoogle = window.adsbygoogle || []).push({})
        </script>
      </div> -->
    </template>
    <!-- <template #sidebar-bottom>
      <Donate />
    </template> -->
    <!-- <template #page-bottom>
      <BuySellAds />
    </template> -->
    <template #page-bottom>
      <!-- <DonateLink /> -->
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import CarbonAds from '@theme/components/CarbonAds.vue'
// import AdUnit from '@theme/components/AdUnit.vue'
// import Donate from '@theme/components/Donate.vue'
// import DonateLink from '@theme/components/DonateLink.vue'
// import BuySellAds from '@theme/components/BuySellAds.vue'
// import Version from '@theme/components/Version.vue'

export default {
  name: 'Layout',
  components: {
    ParentLayout,
    // Version
    CarbonAds
    // AdUnit,
    // Donate,
    // DonateLink
    // BuySellAds
  }
}
</script>
