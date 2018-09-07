<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <div class="dot" v-for="(item, index) in dots" :class="{active: index === currentIndex ? true : false}" :key="index"></div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentIndex: 0
    }
  },
  methods: {
    // 设置轮播组件中的元素宽度
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      this.children = [...this.children]
      // 为每个子元素添加类名和宽度
      this.children.forEach(item => {
        item.classList.add('slider-item')
        item.style.width = sliderWidth + 'px'
        width += sliderWidth
      })
      // 如果设置循环轮播，slider-group 的宽度需要加上 2 张假图片的宽度
      // 注意：窗口大小改变时，不用添加
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // x轴滚动
        scrollY: false, // y轴滚动
        momentum: false, // 惯性
        snap: true, // 是否为轮播图
        snapLoop: this.loop, // 是否能循环轮播
        snapThreshold: 0.3, // 滑动轮播的门槛值
        snapSpeed: 400 // 轮播滚动时的动画持续时间
        // click: true 这个属性会和 fastClick 冲突，由于 a 标签默认会进行跳转，所以不用绑定 click 事件
      })
      this.slider.on('scrollEnd', () => {
        // 获取当前轮播图的索引值
        let sliderIndex = this.slider.getCurrentPage().pageX
        // 如果设置循环轮播， 那么 index 需要减去第一页的假图片
        if (this.loop) {
          sliderIndex -= 1
        }
        this.currentIndex = sliderIndex
        if (this.autoPlay) {
          // 每当滚动结束时，自动调用 this._autoPlay() 这样就能避免使用setInterval()
          clearTimeout(this.timer)
          this._autoPlay()
        }
      })
    },
    // 初始化小圆点
    _initDot() {
      this.dots = new Array(this.children.length)
    },
    // 自动轮播
    _autoPlay() {
      // 每次让当前 index 值 + 1
      let pageIndex = this.currentIndex + 1
      // 如果设置循环轮播，index 需要加上第一页的假图片
      if (this.loop) {
        pageIndex += 1
      }
      // 设置延时为 props 中的 interval 属性
      this.timer = setTimeout(() => {
        // 调用 BScroll 的 goToPage(x轴索引，y轴索引，动画持续事件) 来实现自动轮播
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    },
    // 窗口改变
    handleResize() {
      if (!this.slider) {
        return false
      }
      // 重新计算 slider 的宽度和每个 slider-item 的宽度
      this._setSliderWidth(true)
      // 重新刷新整个 slider
      this.slider.refresh()
    }
  },
  mounted() {
    // dom 渲染到页面上需要 20 ms 的时间，所以我们定义一个定时器，让他在 20ms 后再执行轮播图初始化，
    // 这样就能保证组件正确的加载
    setTimeout(() => {
      this._setSliderWidth()
      this._initDot()
      this._initSlider()
      if (this.autoPlay) {
        this._autoPlay()
      }
      // 当屏幕尺寸发生变化时，重新计算 slider 的宽度
      window.addEventListener('resize', this.handleResize)
    }, 20)
  },
  // 组件摧毁时去清理定时器，或者其他绑定的事件
  beforeDestroy() {
    clearTimeout(this.timer)
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
<style scoped lang="stylus">
  @import "../../../assets/stylus/variable"

  .slider
    min-height: 1px
    position relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
