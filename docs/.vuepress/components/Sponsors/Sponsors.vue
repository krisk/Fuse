<template>
  <div class="sponsors">
    <h4 class="shimmer">Sponsors</h4>
    <div class="sponsor-section silver">
      <a
        class="sponsor-item"
        :href="sponsor.url"
        target="_blank"
        rel="noopener"
        v-for="sponsor in sponsors"
        :key="sponsor.id"
      >
        <img :src="sponsor.imgUrl" :alt="sponsor.name" />
      </a>
      <a href="/donate" class="sponsor-item action">Your logo</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const sponsors = ref([
  {
    id: 1,
    name: 'Worksome',
    imgUrl: '/assets/img/sponsors/worksome.svg',
    url: 'https://www.worksome.com',
    description:
      'Hire and manage talent globally with automated contracts and payroll.'
  },
  {
    id: 2,
    name: 'BairesDev',
    imgUrl: '/assets/img/sponsors/bairesdev.png',
    url: 'https://www.bairesdev.com/sponsoring-open-source-projects/',
    description: 'Outsourced Tech Talent. Fast and Flexible.'
  },
  {
    id: 3,
    name: 'Quadratica',
    imgUrl: '/assets/img/sponsors/quadratica.png',
    url: 'https://quadrati.ca',
    description: 'We will take you from an idea to an in-market product you can rely on. All in record time.'
  }
])
</script>

<style scoped lang="css">
.sponsors {
  padding: 20px 0;
}

.sponsors h4 {
  /* text-align: center; */
  color: var(--c-text-lighter);
}

.sponsors .sponsor-section.silver {
  /* text-align: center;
  margin-top: 0; */
  --max-width: 240px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--max-width), 1fr));
  column-gap: 4px;
}

@media (max-width: 720px) {
  .sponsors .sponsor-section.silver {
    --max-width: 180px;
  }
}

@media (max-width: 480px) {
  .sponsors .sponsor-section.silver {
    --max-width: 150px;
  }
}

.sponsors .sponsor-item {
  /* margin: 10px 20px; */
  background-color: #f9f9f9;
  margin: 2px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 2px;
  transition: background-color 0.2s ease;
  height: calc(var(--max-width) / 2 - 50px);
}

.dark .sponsors .sponsor-item {
  background-color: var(--c-details-bg);
}
.dark .sponsors img {
  filter: grayscale(1) invert(1);
}

.dark .sponsors .sponsor-item:hover {
  color: #213547;
  background-color: #f1f1f1;
}
.dark .sponsors .sponsor-item:hover img {
  filter: none;
}

.sponsors img {
  max-width: calc(var(--max-width) - 30px);
  max-height: calc(var(--max-width) / 2 - 20px);
}
.sponsors .action {
  font-size: 13px;
  color: var(--c-text-lighter);
}
.dark .sponsors .action {
  color: white;
}

.shimmer {
  /* text-align: center; */
  color: rgba(255, 255, 255, 0.1);
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(#222),
    to(#222),
    color-stop(0.5, #fff)
  );
  background: -moz-gradient(
    linear,
    left top,
    right top,
    from(#222),
    to(#222),
    color-stop(0.5, #fff)
  );
  background: gradient(
    linear,
    left top,
    right top,
    from(#222),
    to(#222),
    color-stop(0.5, #fff)
  );
  -webkit-background-size: 125px 100%;
  -moz-background-size: 125px 100%;
  background-size: 125px 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
  -webkit-animation-name: shimmer;
  -moz-animation-name: shimmer;
  animation-name: shimmer;
  -webkit-animation-duration: 2s;
  -moz-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-color: #222;
}

@-moz-keyframes shimmer {
  0% {
    background-position: top left;
  }
  100% {
    background-position: top right;
  }
}

@-webkit-keyframes shimmer {
  0% {
    background-position: top left;
  }
  100% {
    background-position: top right;
  }
}

@-o-keyframes shimmer {
  0% {
    background-position: top left;
  }
  100% {
    background-position: top right;
  }
}

@keyframes shimmer {
  0% {
    background-position: top left;
  }
  100% {
    background-position: top right;
  }
}
</style>
