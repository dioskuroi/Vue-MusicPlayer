<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <!-- 当轮播图数据没有获取到时，不渲染轮播图组件，防止组件内部获取不到元素 -->
        <div v-if="recommends.length" class="slide-wrapper">
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img @load="_loadImage" :src="item.picUrl" />
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌曲推荐</h1>
          <ul>
            <li v-for="(item, index) in discList" :key="index" class="item">
              <div class="icon">
                <img :src="item.imgurl" height="60" width="60">
              </div>
              <div class="text">
                <!-- 利用 v-html 可以将 Unicode 编码转换为中文字符 -->
                <div class="name" v-html="item.creator.name"></div>
                <div class="desc" v-html="item.dissname"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import { getRecommend, getDiscList } from '@/api/recommend.js'
import { ERR_OK } from '@/api/config.js'
import Slider from '@/components/base/slider.vue'
import Scroll from '@/components/base/scroll.vue'
export default {
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  methods: {
    // 获取轮播图数据
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    // 获取歌单数据
    _getDiscList() {
      getDiscList().then(({ data }) => {
        if (data.code === ERR_OK) {
          this.discList = data.data.list
        }
      })
    },
    // 图片加载完毕后，重新刷新滚动组件，计算滚动容器高度
    _loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  components: {
    Slider,
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
  @import "../../assets/stylus/variable.styl"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        height: 0
        padding-top: 40%
        overflow: hidden
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          // 使 flex 子元素垂直居中
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            // 转换主轴为纵轴
            flex-direction: column
            // 使 flex 子元素水平居中
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
