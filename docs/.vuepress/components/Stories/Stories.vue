<template>
  <ul id="stories">
    <li class="story-container" v-for="story in stories">
      <div class="logo-container">
        <a :href="story.url" target="_blank" rel="noopener">
          <img :src="story.imgUrl" style="width: 100px" />
        </a>
      </div>
      <div class="story-data">
        <h4 v-if="story.name">
          {{ story.name }}
        </h4>
        <p v-html="story.description"></p>
      </div>
    </li>
  </ul>
</template>

<script>
let stories = require('./stories.json')

export default {
  name: 'Stories',
  data: () => ({ stories })
}
</script>

<style lang="css">
#stories {
  padding: 0;
}
#stories .story-container {
  display: flex;
  padding: 25px 0;
  border-bottom: 1px dotted #ddd;
}
#stories .logo-container .avatar {
  flex: 0 0 80px;
}
#stories .logo-container .avatar img {
  border-radius: 50%;
  object-fit: cover;
}
#stories .story-data {
  padding-left: 26px;
  flex: 1;
}
#stories .story-data h4 {
  margin-top: 0;
  margin-bottom: 5px;
}
#stories .story-data p {
  margin: 0;
}
</style>
