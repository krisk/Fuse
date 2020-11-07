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
          style="display: block;"
          data-ad-client="ca-pub-3734944050099256"
          data-ad-slot="4159195140"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>
          ;(adsbygoogle = window.adsbygoogle || []).push({})
        </script>
      </div> -->
    </template>
    <template #sidebar-bottom>
      <Donate />
    </template>
    <!-- <template #page-bottom>
      <BuySellAds />
    </template> -->
    <!-- <template #page-bottom>
      <Footer />
    </template> -->
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import CarbonAds from '@theme/components/CarbonAds.vue'
// import AdUnit from '@theme/components/AdUnit.vue'
import Donate from '@theme/components/Donate.vue'
// import Footer from '@theme/components/Footer.vue'
// import BuySellAds from '@theme/components/BuySellAds.vue'
// import Version from '@theme/components/Version.vue'

export default {
  name: 'Layout',
  components: {
    ParentLayout,
    // Version
    CarbonAds,
    // AdUnit,
    Donate
    // Footer
    // BuySellAds
  }
}
</script>
