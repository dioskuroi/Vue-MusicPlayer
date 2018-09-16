import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import mutations from './mutations.js'
import * as getters from './getters.js'
import * as actions from './actions.js'
// vuex 中在 state 发生变化时，在 console 中打印日志
import createLogger from 'vuex/dist/logger.js'

Vue.use(Vuex)
// 检测是否为生产模式
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  // 在非生产模式下开启严格模式，用来检测 vuex
  strict: debug,
  // 在非生产模式下开启日志打印插件
  plugins: debug ? [createLogger()] : []
})