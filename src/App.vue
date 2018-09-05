<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <router-view></router-view>
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
