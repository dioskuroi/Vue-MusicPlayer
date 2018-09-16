import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '@/views/recommend/recommend.vue'
import Rank from '@/views/rank/rank.vue'
import Search from '@/views/search/search.vue'
import Singer from '@/views/singer/singer.vue'
import SingerDetail from '@/views/singer/singerDetail.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})