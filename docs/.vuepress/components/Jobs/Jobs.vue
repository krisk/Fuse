<template>
  <div>
    <input
      type="text"
      v-model="pattern"
      @keyup="onPatternKeyUp"
      placeholder="Filter by keywords, location, job type..."
    />
    <ul id="job-listings">
      <li class="job-container" v-for="job in results">
        <div class="job-data">
          <a :href="job.learn_more_url" target="_blank" rel="noopener">
            <h3>{{ job.role }}</h3>
          </a>
          <div>
            <strong>{{ job.company }}</strong> - <span>{{ job.location }}</span>
          </div>
          <p v-html="job.description"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Fuse from '../../../../dist/fuse.esm.js'
import jobs from './jobs'

export default {
  name: 'Jobs',
  data: () => ({ results: jobs, pattern: '', fuse: null }),
  mounted() {
    this.fuse = new Fuse(jobs, {
      ignoreFieldNorm: true,
      keys: ['role', 'company', 'location', 'tags']
    })
  },
  methods: {
    onPatternKeyUp() {
      let results = this.fuse.search(this.pattern)
      this.results = results.length ? results.map(({ item }) => item) : jobs
    }
  }
}
</script>

<style lang="css">
input {
  padding: 0.45rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  width: 100%;
  color: #3d566e;
  background-color: #fff;
  background-image: none;
  background-clip: padding-box;
  border: 1px solid #e1e3e6;
  border-radius: 4px;
}
#job-listings {
  padding: 0;
}
.job-container {
  display: flex;
  border-bottom: 1px dotted #ddd;
}
#job-listings .job-data h3 {
  margin-bottom: 5px;
}
</style>
