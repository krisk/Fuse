<template>
  <div class="carbon-ads" ref="carbonAdsElementRef"></div>
</template>

<script setup lang="ts">
import { isNullish } from '@sapphire/utilities'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Demo from '../../components/Demo/Demo.vue';

const SCRIPT_ID = '_carbonads_js'
const ACCOUNT_ID = 'CE7IC27U'
const PLACEMENT = 'fusejsio'

const route = useRoute()

const carbonAdsElementRef = ref<HTMLDivElement>()

async function loadCarbonAds() {
  const s = document.createElement('script')
  s.id = SCRIPT_ID
  s.src = `//cdn.carbonads.com/carbon.js?serve=${ACCOUNT_ID}&placement=${PLACEMENT}`
  carbonAdsElementRef?.value?.appendChild(s)
}

let hash = '';
onMounted(() => {
  hash = window.location.hash
  loadCarbonAds()
})

watch(route, (to, from) => {
  if (!isNullish(document.querySelector('#carbonads'))) {
    if (window.location.hash == hash) {
      if (carbonAdsElementRef && carbonAdsElementRef.value) {
        carbonAdsElementRef.value.innerHTML = ''
      }
      loadCarbonAds()
    }
    hash = window.location.hash
  }
})
</script>

<style lang="css">
.carbon-ads {
  min-height: 102px;
  padding: 1.5rem 1.5rem 0;
  margin-bottom: -0.5rem;
  font-size: 0.75rem;
}

.carbon-ads a {
  color: var(--c-text);
  font-weight: normal;
  display: inline;
}

.carbon-ads .carbon-img {
  float: left;
  margin-right: 1rem;
  border: 1px solid var(--c-border);
}

html.dark .carbon-ads .carbon-img {
  border-color: var(--c-border-dark);
}

.carbon-ads .carbon-img img {
  display: block;
}

.carbon-ads .carbon-poweredby {
  color: #999;
  display: block;
  margin-top: 0.5em;
}

@media (max-width: 719px) {
  .carbon-ads .carbon-img img {
    width: 100px;
    height: 77px;
  }
}
</style>
