import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from '@/store'

import fastclick from 'fastclick'
import vueLazyLoad from 'vue-lazyload'

import '@/assets/stylus/index.styl'

Vue.use(vueLazyLoad, {
  loading: require('@/assets/image/default.png')
})

Vue.config.productionTip = false

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
