import jsonp from '@/utils/jsonp.js'
import { commonParams, options } from './config.js'

export const getSingerList = () => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    loginUin: 380644489,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}