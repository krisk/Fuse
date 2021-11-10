<template>
  <div id="sponsors">
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

<script>
let sponsors = require('./sponsors.json')

export default {
  name: 'Sponsors',
  data: () => ({ sponsors })
}
</script>

<style lang="css">
#sponsors {
  padding: 20px 0;
}
#sponsors h4 {
  text-align: center;
  color: #999;
}
#sponsors .sponsor-section {
  text-align: center;
  margin-top: 0;
}
#sponsors .sponsor-section a {
  margin: 10px 20px;
}
#sponsors .sponsor-section a,
#sponsors .sponsor-section img {
  max-width: 180px;
  display: inline-block;
  vertical-align: middle;
}
</style>
