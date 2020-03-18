<template>
  <h2 style="text-align: center;">模块正在开发或维护，你可以
    <el-link @click="toHome()" type="primary">返回首页</el-link>
  </h2>
</template>

<script>
export default {
  methods: {
    toHome() {
      this.$router.push('/home');
    }
  },
};
</script>

<style lang="scss" scoped>
  .el-divider__text, .el-link{
    font-size: inherit;
  }
</style>
