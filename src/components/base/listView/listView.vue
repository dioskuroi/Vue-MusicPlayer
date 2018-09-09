<template>
  <scroll
    :data="data"
    class="listview"
    ref="listView"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
    <ul>
      <li class="list-group" v-for="(group, index) in data" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="(item, i) in group.items" class="list-group-item" :key="i">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 注意：在注册 touchmove 事件的时候，由于他的父元素，scroll 组件也能滚动，
              所以要阻止事件冒泡和阻止浏览器的默认时间 -->
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          class="item"
          :data-index="index"
          v-for="(item, index) in shortcut"
          :key="index"
          :class="{current: currentIndex === index}"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from '@/components/base/scroll/scroll.vue'
import Loading from '@/components/base/loading/loading.vue'

// 每个 shortcut 的高度
const ANCHOR_HEIGHT = 18
// 每个 listGroup 的 title 的高度
const TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: 0
    }
  },
  computed: {
    shortcut() {
      return this.data.map(item => {
        return item.title.slice(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) return ''
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    // 点击某个快捷索引，能定位到此索引的歌手列表
    onShortcutTouchStart(e) {
      const anchorIndex = e.target.dataset.index
      this.touch.y1 = e.touches[0].pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    // 在快捷索引滑动时，歌手列表也能跟着滑动
    onShortcutTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY
      // 这里的或 0 就相当于 Math.floor 的效果，向下取整
      const delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      this._scrollTo(this.touch.anchorIndex / 1 + delta)
    },
    // scroll 组件内部会触发滚动事件
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 封装滚动方法
    _scrollTo(index) {
      // 当点击快捷索引栏时，需要手动给 scrollY 赋值
      this.scrollY = -this.listHeight[index]
      console.log(this.scrollY)
      // scrollToElement 第二个参数是指定缓动动画的持续时间，0表示没有动画效果
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 得到每个 listGroup 的触发高度，计算当前视窗落在哪个区间，从而设置 shortcut 高亮效果
    _calculateHeight() {
      // 第一个 listGroup 的触发高度为 0
      let height = 0
      this.listHeight.push(height)
      // 每个 listGroup 的触发高度等于前面所以的 listGroup 的高度之和
      this.$refs.listGroup.forEach(item => {
        height += item.clientHeight
        this.listHeight.push(height)
      })
    }
  },
  watch: {
    // 当数据发生变化时，需要重新计算一次每个 listGroup 的触发区间
    data() {
      // dom 渲染需要 17ms 的时间，这里使用 setTimeout 比 this.$nextTick 的兼容性好
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newVal) {
      // 如果 -newVal 大于 0，那说明下拉超过第一个 listGroup 上限，这时就让第一个 listGroup 高亮
      if (-newVal < 0) {
        this.currentIndex = 0
        return true
      }
      // 如果 -newVal 大于最后一个 listGroup 的下限，这是就让最后一个 listGroup 高亮
      if (-newVal > this.listHeight[this.listHeight.length - 1]) {
        this.currentIndex = this.listHeight.length - 2
      }
      this.listHeight.some((item, index, arr) => {
        // listGroup 的顶部
        const height1 = item
        // listGroup 的底部
        const height2 = arr[index + 1]
        if (-newVal >= height1 && -newVal < height2) {
          this.currentIndex = index
          // 计算 listGroup 下限 和 scrollY 的差值
          this.diff = height2 + newVal
          return true
        }
      })
    },
    diff(newVal) {
      // 如果差值大于 title 高度，那说明还没有滚到 title 的位置，就让 fixedTop 等于 0，
      // 如果差值小于 title 高度，那说明需要将上一个 title 往上顶，就要让 fixedTop 等于 这个差值减去 title 的高度
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      // 性能优化，当 fixedTop 没有发生变化时，不要重新渲染 dom
      if (this.fixedTop === fixedTop) return false
      this.fixedTop = fixedTop
      // 开启 GPU 渲染
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  // 在 vue 实例中，data 和 props 中的参数都会被绑定 getter 和 setter，用于渲染页面
  // 而一些不需要渲染到页面上的数据，我们就不必定义到 data 中，而是在 created 钩子中定义即可
  created() {
    this.touch = {}
    this.listenScroll = true
    this.probeType = 3
    this.listHeight = []
  }
}
</script>
<style lang="stylus" scoped>
  @import "../../../assets/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
