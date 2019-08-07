import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Board from '@/components/Board'
import Threads from '@/components/Threads'
import Thread from '@/components/Thread'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/',      component: HelloWorld },
    {
      path: '/board', component: Board,
      children: [
        // UserHome will be rendered inside User's <router-view>
        // when /user/:id is matched
        { path: '/board/threads', component: Threads },
        { path: '/board/thread/:id', component: Thread, name: 'specificThread' },

        // ...other sub routes
      ]
    },
    
  ]
})