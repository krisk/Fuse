<template>
  <div class="donate">
    <hr />
    <!-- <a href="/support.html" title="Donate">❤️️ Fuse.js? Consider donating!</a> -->
    <a href="/support.html" class="donate-btn">♡ Fuse.js? Donate Now</a>
  </div>
</template>

<script>
export default {
  name: 'Donate'
}
</script>

<style lang="css">
.donate {
  padding: 5px 25px 20px;
}
.donate a {
  font-weight: bold;
}

.donate-btn {
  display: inline-block;
  text-align: center;
  text-decoration: none;
  border: 0;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: antialiased;
  outline: 0;
  box-sizing: border-box;
  background: #9066b8;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  border-radius: 20px;
  margin: 20px 0 0 0;
  padding: 10px 30px;
}
.donate-btn:focus {
  outline: 0;
}
.donate-btn:hover {
  background-color: #a684c6;
  transition: background-color 250ms;
}
</style>
