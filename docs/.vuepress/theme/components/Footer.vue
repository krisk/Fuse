<template>
  <div class="donate-link-wrapper">
    <a href="/support.html" title="Donate">❤️️ Fuse.js? Consider donating!</a>
  </div>
</template>

<script>
export default {
  name: 'Footer'
  //   watch: {
  //     $route(to, from) {
  //       //   console.log(to)
  //       //   if (
  //       //     to.fullPath !== from.fullPath &&
  //       //     // Only reload if the ad has been loaded
  //       //     // otherwise it's possible that the script is appended but
  //       //     // the ads are not loaded yet. This would result in duplicated ads.
  //       //     // this.$el.querySelector('#carbonads')
  //       //   ) {
  //       //     this.$el.innerHTML = ''
  //       //     this.load()
  //       //   }
  //     }
  //   }
}
</script>

<style lang="stylus">
.donate-link-wrapper
  font-size 0.95rem
  max-width $contentWidth
  margin 0px auto
  padding 1rem 2rem 0
  margin-bottom -1rem
@media (max-width: $MQMobileNarrow)
  .donate-link-wrapper
    padding 0 1.5rem
</style>
