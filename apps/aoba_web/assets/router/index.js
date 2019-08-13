import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Board from '@/components/Board'
import Threads from '@/components/Threads'
import Thread from '@/components/Thread'
import {aobsStore, store} from '../store'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/',      component: HelloWorld,
  },


    {
      path: '/board', component: Board,
      
      children: [
        // UserHome will be rendered inside User's <router-view>
        // when /user/:id is matched
        { path: '/board/threads', component: Threads },
        {
          path: '/board/thread/:id',
          component: Thread,
          name: 'specificThread',
          
          beforeEnter: (to, from, next) => {
            console.log('FROM ' + from);//not even this
            console.log('TO ' + to);//not even this
            console.log(store.state)
            // Si la URL es del hilo cuando arranca la aplicación lobby será undefined
            store.state.lobby && store.state.lobby.changeThread({thread_id: parseInt(to.params.id)})
            
            
            next();
          },
        
        
        },

        // ...other sub routes
      ]
    },
    
  ]
})