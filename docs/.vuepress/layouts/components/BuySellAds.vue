<template>
  <div class="bsa-cpc-wrapper">
    <div class="bsa-cpc" ref="bsaAdsElementRef"></div>
  </div>
</template>

<script setup lang="ts">
import { isNullish } from '@sapphire/utilities'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const SCRIPT_ID = 'bsa-cpc-script'
const ACCOUNT_ID = 'CE7IV27Y'
const PLACEMENT = 'fusejsio'

const route = useRoute()

const bsaAdsElementRef = ref<HTMLDivElement>()

async function loadBuySellAds() {
  if (!isNullish(_bsa)) {
    _bsa.init('default', ACCOUNT_ID, `placement:${PLACEMENT}`, {
      target: '.bsa-cpc',
      align: 'horizontal',
      disable_css: 'true'
    })
  }
}

onMounted(() => {
  if (!document.getElementById(SCRIPT_ID)) {
    const s = document.createElement('script')
    s.id = SCRIPT_ID
    s.src = `//m.servedby-buysellads.com/monetization.js`
    document.head.appendChild(s)
    s.onload = () => {
      loadBuySellAds()
    }
  } else {
    loadBuySellAds()
  }
})

watch(route, () => {
  bsaAdsElementRef.value.innerHTML = ''
  loadBuySellAds()
})
</script>

<style lang="css">
.bsa-cpc-wrapper {
  font-size: 0.95rem;
  max-width: var(--content-width);
  margin: 0px auto;
  padding: 1rem 2rem 0;
  margin-bottom: -1rem;
}

@media (max-width: 419px) {
  .bsa-cpc-wrapper {
    padding: 0 1.5rem;
  }
}

.bsa-cpc {
  font-size: 0.9em;
  background-color: #f8f8f8;
  border-radius: 6px;
}

.bsa-cpc a._default_ {
  text-align: left;
  display: block;
  padding: 10px 15px 12px;
  margin-bottom: 20px;
  color: #666;
  font-weight: 400;
  line-height: 18px;
}

.bsa-cpc a._default_ .default-image img {
  height: 20px;
  border-radius: 3px;
  vertical-align: middle;
  position: relative;
  top: -1px;
}

.bsa-cpc a._default_ .default-title {
  font-weight: 600;
}

.bsa-cpc a._default_ .default-description:after {
  font-size: 0.85em;
  content: 'Sponsored';
  color: #1c90f3;
  border: 1px solid #1c90f3;
  border-radius: 3px;
  padding: 0 4px 1px;
  margin-left: 6px;
}

.bsa-cpc .default-ad {
  display: none;
}

.bsa-cpc a._default_ .default-image,
.bsa-cpc a._default_ .default-title,
.bsa-cpc a._default_ .default-description {
  display: inline;
  vertical-align: middle;
  margin-right: 6px;
}
</style>
