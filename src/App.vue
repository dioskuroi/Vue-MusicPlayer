<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <!-- keep-alive 会缓存包裹在其中的元素，不会使 vue 组件进入 destory 阶段 -->
    <!-- 所以组件不会进入 beforeDestory 和 destoryed 钩子函数 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MHeader from '@/components/m-header/m-header.vue'
import MTab from '@/components/m-tab/m-tab.vue'
export default {
  name: 'App',
  components: {
    MHeader,
    MTab
  }
}
</script>

<style scoped lang="stylus">
  @import './assets/stylus/variable.styl'
</style>
