<template>
  <div class="music-list">
    <div class="back" @click="_back">
      <i class="icon-back"></i>
    </div>
    <div class="title" v-html="title"></div>
    <div
      class="bg-image"
      :style="bgStyle"
      ref="bgImage">
      <div class="play-wrapper" v-show="songs.length" ref="playBtn">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 图片上方的遮罩层 -->
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 跟随列表上滑滚动层 -->
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll
      @scroll="scroll"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      :data="songs"
      class="list"
      ref="list">
      <!-- 为了设置 song-list 的样式，多添加了一个 div -->
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectSong"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from '@/components/base/scroll/scroll.vue'
import SongList from '@/components/base/song-list/song-list.vue'
import Loading from '@/components/base/loading/loading.vue'
import { prefixStyle } from '@/utils/dom.js'
import { mapActions } from 'vuex'
// 图片最小显示高度
const RESERVED_HEIGHT = 40
// 设置浏览器前缀
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    // 设置背景图片
    bgStyle() {
      return { 'background-image': `url(${this.bgImage})` }
    }
  },
  created() {
    // scroll 参数，由于不需要监听，所以不写在 data 中
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    // 背景图片高度
    this.bgImageHeight = this.$refs.bgImage.clientHeight
    // 最大 layer 上滚距离
    this.minTranslateY = -this.bgImageHeight + RESERVED_HEIGHT
    // 设置列表的 top 值，由于在不同的手机上，屏幕大小不同， 所以需要手动设置
    this.$refs.list.$el.style.top = `${this.bgImageHeight}px`
  },
  methods: {
    // scroll 组件触发 scroll 事件
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 返回
    _back() {
      this.$router.go(-1)
    },
    selectSong(song, index) {
      this.selectPlay({list: this.songs, index})
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  watch: {
    scrollY(newVal) {
      // layer 层的滚动距离，最大需要留 40px
      let translateY = Math.max(newVal, this.minTranslateY)
      // zIndex 到了两端极限时为10
      let zIndex = newVal < this.minTranslateY ? 10 : 0
      zIndex = newVal > 0 ? 10 : zIndex
      // 计算滚动距离和图片高度的比例，用于计算图片放大比例和图片模糊比例
      let percent = newVal / this.bgImageHeight
      // 图片放大比例
      let scale = newVal > 0 ? 1 + percent : 1
      // 图片模糊比例
      let blur = newVal < 0 ? Math.min(20 * percent, 20) : 0
      // 图片 paddingTop 的值， 当上拉到极限时为 40px，其余都为 70%
      let bgImagePaddingTop = newVal < this.minTranslateY ? `${RESERVED_HEIGHT}px` : '70%'
      // 随机播放按钮的显示隐藏
      let playBtnDisplay = newVal < this.minTranslateY ? 'none' : 'block'
      // 上拉时，layer 层跟随列表一起滚动
      this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`
      // 下拉和上滑到极限时，提高背景图片层的 zIndex ，使图片产生遮挡文字和图片放大效果
      this.$refs.bgImage.style.zIndex = zIndex
      // 上滑时，使图片缩小
      this.$refs.bgImage.style.paddingTop = bgImagePaddingTop
      // 下拉到顶部时，使图片放大
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      // 添加高斯模糊
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // 控制随机播放按钮的显示隐藏
      this.$refs.playBtn.style.display = playBtnDisplay
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus" scoped>
  @import "../../assets/stylus/variable"
  @import "../../assets/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
