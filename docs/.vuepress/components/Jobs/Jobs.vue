<template>
  <input
    class="filter-input"
    type="text"
    v-model="pattern"
    @keyup="onPatternKeyUp"
    placeholder="Filter by keywords, location, job type..."
  />
  <section>
    <ul class="job-listings">
      <li class="job-container" v-for="job in results">
        <article class="job-data">
          <a :href="job.learn_more_url" target="_blank" rel="noopener">
            <p class="job-title">{{ job.role }}</p>
          </a>
          <div>
            <strong>{{ job.company }}</strong> - <span>{{ job.location }}</span>
          </div>
          <p v-html="job.description"></p>
        </article>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Fuse from '../../../../dist/fuse'
import jobsData from './jobs'

const results = ref(jobsData)
const pattern = ref('')
const fuse = ref(
  new Fuse(jobsData, {
    ignoreFieldNorm: true,
    keys: ['role', 'company', 'location', 'tags']
  })
)

function onPatternKeyUp() {
  let newSearchResults = fuse.value.search(pattern.value)
  results.value = newSearchResults.length
    ? newSearchResults.map(({ item }) => item)
    : jobsData
}
</script>

<style scoped lang="css">
.filter-input {
  font-size: 16px;
  width: 100%;

  color: rgb(156, 181, 200);
  background-color: rgb(24, 26, 27);
  background-image: none;
  border-color: rgb(56, 60, 63);

  padding: 0.45rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  width: 96%;
  border: 1px solid #e1e3e6;
  border-radius: 4px;
}

html.dark .filter-input {
  border: 1px solid #878e99;
}

.job-listings {
  padding: 0;
}

.job-container {
  display: flex;
  border-bottom: 1px dotted #ddd;
}

.job-listings .job-data .job-title {
  margin-bottom: 5px;
  font-weight: 600;
  line-height: 1.25;
  overflow-wrap: break-word;
  font-size: 1.35rem;
}
</style>
