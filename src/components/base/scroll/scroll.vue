<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return false
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
        })
      }
    },
    // 可用
    enable() {
      this.scroll && this.scroll.enable()
    },
    // 禁用
    disable() {
      this.scroll && this.scroll.disable()
    },
    // 刷新，重新初始化 BScroll 插件
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    // 滚动到某个值
    scrollTo(...args) {
      this.scroll && this.scroll.scrollTo(...args)
    },
    // 滚动到某个元素
    scrollToElement(...args) {
      this.scroll && this.scroll.scrollToElement(...args)
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>
<style lang="stylus">

</style>
