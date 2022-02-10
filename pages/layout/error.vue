<template>
  <div class="container">
    <h1>访问路径错误</h1>
    <span>即将返回&nbsp;<nuxt-link to="/">首 页</nuxt-link></span>
  </div>
</template>

<script>
  export default { // 你可以为错误页面指定自定义的布局,
    created() {
      setTimeout(() => {
        this.$router.push('/')
      }, 1000)
    },
  }
</script>