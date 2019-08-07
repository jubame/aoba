import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Board from '@/components/Board'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/',      component: HelloWorld },
    { path: '/board', component: Board }
  ]
})