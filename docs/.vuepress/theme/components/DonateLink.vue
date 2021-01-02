<template>
  <div v-if="visible" class="donate-link-wrapper">
    <a href="/support.html" title="Donate"
      >❤️️ Fuse.js? Support its development with a small donation.</a
    >
  </div>
</template>

<script>
export default {
  name: 'DonateLink',
  computed: {
    visible() {
      return !this.$frontmatter.noDonationLink
    }
  }
}
</script>

<style lang="stylus">
.donate-link-wrapper
  font-size 0.95rem
  max-width $contentWidth
  margin 0px auto
  padding 1rem 2rem 0
  margin-bottom -1rem
  a
    font-weight: bold
@media (max-width: $MQMobileNarrow)
  .donate-link-wrapper
    padding 0 1.5rem
</style>
