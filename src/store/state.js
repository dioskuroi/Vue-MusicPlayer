import { playMode } from '@/utils/config.js'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [], // 播放歌曲列表
  sequenceList: [], // 播放顺序列表
  playMode: playMode.sequence,
  currentIndex: -1
}

export default state