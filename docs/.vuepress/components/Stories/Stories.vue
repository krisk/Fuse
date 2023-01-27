<template>
  <ul class="stories">
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

<script setup lang="ts">
import { ref } from 'vue'

const stories = ref([
  {
    name: 'Notejoy',
    imgUrl: '/assets/img/products/notejoy@2x.png',
    url: 'https://notejoy.com/',
    description:
      'Drowning in email & Slack? <a href="https://notejoy.com/" target="_blank" rel="noopener">Notejoy</a>\'s fast and focused workspace is the perfect solution. Its Quick Find experience, powered by Fuse.js, makes it incredibly quick to jump to any specific note.'
  },
  {
    imgUrl: '/assets/img/products/notebag@2x.png',
    url: 'https://notebag.app/',
    description:
      '<a href="https://notebag.app/" target="_blank" rel="noopener">Notebag</a> is a new experience in note taking, designed from the ground up to be usable from your keyboard. Its fuzzy searching is powered by Fuse.js.'
  }
])
</script>

<style scoped lang="css">
.stories {
  padding: 0;
}

.stories .story-container {
  display: flex;
  padding: 25px 0;
  border-bottom: 1px dotted #ddd;
}

.stories .logo-container .avatar {
  flex: 0 0 80px;
}

.stories .logo-container .avatar img {
  border-radius: 50%;
  object-fit: cover;
}

.stories .story-data {
  padding-left: 26px;
  flex: 1;
}

.stories .story-data h4 {
  margin-top: 0;
  margin-bottom: 5px;
}

.stories .story-data p {
  margin: 0;
}
</style>
