<template>
  <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer.js'
import { ERR_OK } from '@/api/config.js'
import { createSong } from '@/utils/song.js'
import MusicList from '@/views/music-list/music-list.vue'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  methods: {
    _getDetail(singerId) {
      // 如果用户在歌手详情页面刷新，由于 vuex 中的 singer 也会重置，无法获取歌手 id，
      // 所以让页面强制回退到歌手列表页
      if (!this.singer.id) {
        return this.$router.push('/singer')
      }
      getSingerDetail(singerId).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs(list) {
      const ret = []
      list.forEach(item => {
        const { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created() {
    this._getDetail(this.singer.id)
  },
  components: {
    MusicList
  }
}
</script>
<style scoped lang="stylus">
</style>
