import jsonp from '@/utils/jsonp.js'
import axios from 'axios'
import { commonParams, options } from '@/api/config.js'

export const getRecommend = () => {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 380644489,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export const getDiscList = () => {
  const url = '/api/getDiscList'
  const params = Object.assign({}, commonParams, {
    rnd: Math.random(),
    picmid: 1,
    loginUin: 380644489,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  })
  return axios.get(url, { params })
}