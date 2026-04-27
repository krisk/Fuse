<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, useTemplateRef } from 'vue'

// Bump the version suffix to re-show the banner to people who already dismissed it.
const STORAGE_KEY = 'fuse-sponsor-banner-dismissed-v1'

const visible = ref(false)
const bannerEl = useTemplateRef<HTMLElement>('bannerEl')
let observer: ResizeObserver | null = null

function setLayoutTopHeight(px: number) {
  document.documentElement.style.setProperty('--vp-layout-top-height', `${px}px`)
}

function clearLayoutTopHeight() {
  document.documentElement.style.removeProperty('--vp-layout-top-height')
}

onMounted(() => {
  try {
    if (localStorage.getItem(STORAGE_KEY) !== '1') {
      visible.value = true
    }
  } catch {
    visible.value = true
  }
})

watch(visible, async (isVisible) => {
  if (!isVisible) {
    observer?.disconnect()
    observer = null
    clearLayoutTopHeight()
    return
  }
  await nextTick()
  const el = bannerEl.value
  if (!el) return
  setLayoutTopHeight(el.offsetHeight)
  observer = new ResizeObserver(() => {
    if (bannerEl.value) setLayoutTopHeight(bannerEl.value.offsetHeight)
  })
  observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearLayoutTopHeight()
})

function dismiss() {
  visible.value = false
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // localStorage unavailable (private mode, storage disabled) — banner just won't persist
  }
}
</script>

<template>
  <div
    v-if="visible"
    ref="bannerEl"
    class="sponsor-banner"
    role="region"
    aria-label="Sponsorship announcement"
  >
    <span class="sponsor-banner__text">
      <span class="sponsor-banner__lede">Looking for sponsors</span>
      <span class="sponsor-banner__sep">·</span>
      <span>Help keep Fuse.js maintained</span>
    </span>
    <a class="sponsor-banner__cta" href="/sponsor.html" @click="dismiss">Sponsor &rarr;</a>
    <button
      class="sponsor-banner__close"
      type="button"
      aria-label="Dismiss sponsor banner"
      @click="dismiss"
    >
      &times;
    </button>
  </div>
</template>

<style scoped>
.sponsor-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--vp-z-index-layout-top);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 8px 44px;
  background: linear-gradient(90deg, #9066b8 0%, #7d57a8 100%);
  color: #fff;
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
}

.sponsor-banner__text {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.sponsor-banner__lede {
  font-weight: 600;
}

.sponsor-banner__sep {
  opacity: 0.55;
}

.sponsor-banner__cta {
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 4px;
  color: #fff !important;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.sponsor-banner__cta:hover {
  background: rgba(255, 255, 255, 0.26);
  text-decoration: none;
}

.sponsor-banner__close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.75;
  border-radius: 4px;
  transition: opacity 0.15s ease, background-color 0.15s ease;
}

.sponsor-banner__close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.12);
}

.sponsor-banner__close:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 1px;
}

@media (max-width: 640px) {
  .sponsor-banner {
    padding: 8px 38px 8px 14px;
    font-size: 13px;
    gap: 10px;
  }

  .sponsor-banner__sep {
    display: none;
  }
}
</style>
