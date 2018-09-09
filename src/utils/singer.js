/**
 * 定义一个歌手类
 * @param { Object } obj id为歌手ID，name为歌手名
 */
export default class Singer {
  constructor({ id, name }) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}