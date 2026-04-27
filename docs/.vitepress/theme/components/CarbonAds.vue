<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const CARBON_SERVE_CODE = 'CE7IC27U'
const CARBON_PLACEMENT = 'fusejsio'
const SCRIPT_ID = '_carbonads_js'

const container = ref<HTMLDivElement | null>(null)
const route = useRoute()

function loadCarbonAds() {
  if (!container.value) return
  container.value.innerHTML = ''
  const script = document.createElement('script')
  script.async = true
  script.id = SCRIPT_ID
  script.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_SERVE_CODE}&placement=${CARBON_PLACEMENT}`
  container.value.appendChild(script)
}

onMounted(loadCarbonAds)

// carbon.js fires once on initial load; reload on SPA navigation.
watch(() => route.path, loadCarbonAds)
</script>

<template>
  <div ref="container" class="carbon-ads-container" />
</template>

<style>
.carbon-ads-container {
  margin: 32px 0 0;
  min-height: 102px;
}

#carbonads {
  font-family: var(--vp-font-family-base);
  font-size: 12px;
  line-height: 1.4;
  display: block;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 6px;
  padding: 12px;
  transition: border-color 0.2s;
}

#carbonads:hover {
  border-color: var(--vp-c-brand-1);
}

#carbonads a,
#carbonads a:hover {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

#carbonads .carbon-img {
  display: block;
  margin-bottom: 8px;
}

#carbonads .carbon-img img {
  display: block;
  max-width: 100%;
}

#carbonads .carbon-text {
  display: block;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

#carbonads .carbon-poweredby {
  display: block;
  margin-top: 8px;
  font-size: 10px;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
