<template>
  <div class="sponsors">
    <h4>GitHub Silver Sponsors</h4>
    <p class="sponsor-section">
      <a
        :href="sponsor.url"
        target="_blank"
        rel="noopener"
        v-for="sponsor in sponsors"
      >
        <img :src="sponsor.imgUrl" />
      </a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const sponsors = ref([
  {
    name: 'Worksome',
    imgUrl: '/assets/img/sponsors/worksome.svg',
    url: 'https://www.worksome.com',
    description:
      'Hire and manage talent globally with automated contracts and payroll.'
  }
])
</script>

<style scoped lang="css">
.sponsors {
  padding: 20px 0;
}

.sponsors h4 {
  text-align: center;
  color: #999;
}

.sponsors .sponsor-section {
  text-align: center;
  margin-top: 0;
}

.sponsors .sponsor-section a {
  margin: 10px 20px;
}

.sponsors .sponsor-section a,
.sponsors .sponsor-section img {
  max-width: 180px;
  display: inline-block;
  vertical-align: middle;
}
</style>
