<template>
  <div class="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>
<script>
import { getSingerList } from '@/api/singer.js'
import { ERR_OK } from '@/api/config.js'
import Singer from '@/utils/singer.js'
import ListView from '@/components/base/listView/listView.vue'

// 热门歌手的常量
const HOT_NAME = '热门'
// 默认前十位为热门歌手
const HOT_SINGER_LEN = 10
export default {
  data() {
    return {
      singers: []
    }
  },
  methods: {
    // 获取歌手数据
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    // 格式化歌手数据
    _normalizeSinger(list) {
      const map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 选择前10位为热门歌手
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        // 根据 Findex 归类歌手，按照其姓名首字母归类
        const key = item.Findex
        if (!(key in map)) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 将结果按顺序放进数组中
      const hot = []
      const ret = []
      Object.keys(map).forEach(key => {
        if (key === 'hot') {
          hot.push(map[key])
        } else if (key.match(/[a-zA-Z]/)) {
          ret.push(map[key])
        }
      })
      // 从 A-Z 进行排序
      ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      return hot.concat(ret)
    }
  },
  components: {
    ListView
  },
  created() {
    this._getSingerList()
  }
}
</script>
<style lang="stylus" scoped>
  .singer
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
</style>
