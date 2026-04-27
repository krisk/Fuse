<script setup lang="ts">
import { ref } from 'vue'

const sponsors = ref([
  {
    id: 1,
    name: 'BairesDev',
    imgUrl: '/assets/img/sponsors/bairesdev.png',
    url: 'https://www.bairesdev.com/sponsoring-open-source-projects/'
  }
])
</script>

<template>
  <div class="sponsors-rail">
    <p class="sponsors-rail-label">SPONSORS</p>
    <div class="sponsors-rail-grid">
      <a
        v-for="sponsor in sponsors"
        :key="sponsor.id"
        class="sponsors-rail-item"
        :href="sponsor.url"
        target="_blank"
        rel="noopener"
      >
        <img :src="sponsor.imgUrl" :alt="sponsor.name" />
      </a>
    </div>
    <a class="sponsors-rail-cta" href="/sponsor.html">Become a Sponsor</a>
  </div>
</template>

<style scoped>
.sponsors-rail {
  margin: 24px 0 0;
}

.sponsors-rail-label {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
}

.sponsors-rail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 6px;
}

.sponsors-rail-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 8px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 6px;
  transition: border-color 0.2s, background-color 0.2s;
  text-decoration: none;
  color: var(--vp-c-text-2);
  font-size: 11px;
}

.sponsors-rail-item:hover {
  border-color: var(--vp-c-brand-1);
}

.sponsors-rail-item img {
  max-width: 100%;
  max-height: 32px;
  display: block;
}

.dark .sponsors-rail-item img {
  filter: grayscale(1) invert(1);
  transition: filter 0.2s;
}

.dark .sponsors-rail-item:hover {
  background-color: #fff;
  border-color: #fff;
}

.dark .sponsors-rail-item:hover img {
  filter: none;
}

.sponsors-rail-cta {
  display: block;
  margin-top: 8px;
  padding: 6px 8px;
  text-align: center;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 6px;
  font-size: 11px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: border-color 0.2s;
}

.sponsors-rail-cta:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>
