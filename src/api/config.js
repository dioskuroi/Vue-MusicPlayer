// 配置请求的常用参数
export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 380644489,
  format: 'jsonp'
}

// 配置 jsonp 插件的 option
export const options = {
  param: 'jsonpCallback',
  prefix: 'jp'
}

// 语义化常用的响应码
export const ERR_OK = 0