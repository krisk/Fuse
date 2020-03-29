<template>
  <span class="version">v{{ version }}</span>
</template>

<script>
export default {
  name: 'Version',
  data: () => ({
    version: ''
  }),
  mounted() {
    this.version = this.$site.themeConfig.version
  },
  methods: {}
}
</script>

<style lang="css">
.version {
  width: 100%;
  padding: 5px 25px;
  display: inline-block;
}
</style>
