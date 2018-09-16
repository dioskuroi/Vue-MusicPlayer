let elementStyle = document.createElement('div').style

// 测试浏览器厂商
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  return Object.keys(transformNames).find(key => elementStyle[transformNames[key]] !== undefined)
})()

// 给 css 样式追加浏览器厂商前缀
export const prefixStyle = style => {
  if (vendor === undefined) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.slice(1)
}