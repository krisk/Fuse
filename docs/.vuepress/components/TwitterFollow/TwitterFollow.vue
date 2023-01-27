<template>
  <a :href="fullyQualifiedHref" class="twitter-btn">
    <TwitterBird class="twitter-bird" /> Follow
  </a>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TwitterBird from './TwitterBird.vue'

const url = new URL('https://twitter.com/intent/follow')
url.searchParams.append(
  'original_referer',
  __VUEPRESS_SSR__ ? 'https://fusejs.io' : window.location.href
)
url.searchParams.append(
  'ref_src',
  encodeURIComponent('twsrc^tfw|twcamp^buttonembed|twterm^follow|twgr^kirorisk')
)
url.searchParams.append('region', 'follow_link')
url.searchParams.append('screen_name', 'kirorisk')

const fullyQualifiedHref = ref(url.toString())
</script>

<style scoped>
.twitter-bird {
  height: 12px;
}

.twitter-btn {
  font-size: 12px;
  position: relative;
  height: 28px;
  box-sizing: border-box;
  padding: 1px 12px 1px 12px;
  background-color: #1d9bf0;
  color: #fff;
  border-radius: 9999px;
  font-weight: bolder;
  cursor: pointer;
  visibility: visible;
  width: 86px;
  display: flex;
  align-items: center;
  justify-content: stretch;
  gap: 4px;
}
</style>
