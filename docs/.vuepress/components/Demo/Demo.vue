<template functional>
  <div class="live-demo">
    <iframe
      src="https://codesandbox.io/embed/fuse-options-demo-embedded-o568p?autoresize=1&fontsize=14&hidenavigation=1&theme=light&view=preview"
      title="Fuse Options Demo (embedded)"
      sandbox="allow-forms allow-same-origin allow-scripts">
    </iframe>
  </div>
</template>

<script>
export default {
  name: 'Demo',
}
</script>

<style lang="css">
.live-demo iframe {
  /* 20px subtracts the codesandbox iframe */
  width: calc(100% + 20px);
  margin-left: -20px;
  min-height: 700px;
  border: 0;
  border-radius: 0;
  overflow: hidden;
}
</style>
