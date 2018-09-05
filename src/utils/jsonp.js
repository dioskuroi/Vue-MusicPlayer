import originJSONP from 'jsonp'

/**
 * jsonp 请求函数
 * @param { String } url 地址
 * @param { Object } data 参数对象
 * @param { Object } option jsonp 插件配置选项（用来配置传递 callback 函数名）
 */
export default function jsonp(url, data, option) {
  return new Promise((resolve, reject) => {
    url += (url.includes('?') ? '&' : '?') + param(data)
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

/**
 * 格式化地址栏参数
 * @param { Object } data 格式化 url 地址栏参数
 */
function param(data) {
  let url = ''
  Object.keys(data).forEach(key => {
    let value = data[key] === undefined ? '' : data[key]
    url += `&${key}=${encodeURIComponent(value)}`
  })
  return url ? url.slice(1) : ''
}
