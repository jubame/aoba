import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Board from '@/components/Board'
import Threads from '@/components/Threads'
import Thread from '@/components/Thread'
import {aobsStore, store} from '../store'
import {currThread} from '../js/socket'

Vue.use(Router)

export default new Router({
  routes: [
    { name: 'home', path: '/',      component: HelloWorld,
  },


    {
      path: '/board', component: Board,
      
      children: [
        // UserHome will be rendered inside User's <router-view>
        // when /user/:id is matched
        {
          name: 'multipleThreads',
          path: '/board/threads',
          component: Threads,
          beforeEnter: (to, from, next) => {
            if (store.state.lobby){
              store.state.lobby.catalog()
            } else {
              console.log(`beforeEnter ${to.fullPath}: lobby not yet available`)
            }
            
            
            next();
          },
        },
        {
          name: 'specificThread',
          path: '/board/thread/:id',
          component: Thread,
          
          
          beforeEnter: (to, from, next) => {
            /* lobby será undefined si la URL es la del hilo cuando arranca la
             * aplicación (por ejemplo, si el usuario escribe la URL o la
             * pega en una pestaña/ventana nueva, que no tenga la aplicación
             * previamente cargada).
             * En App.vue hago un EventBus.$emit('lobby_joined') que capturo
             * en Thread.vue para hacer join al hilo.
             */
            if (store.state.lobby){
              store.state.lobby.changeThread({thread_id: parseInt(to.params.id)})
            } else {
              console.log(`beforeEnter ${to.fullPath}: lobby not yet available`)
            }
            
            
            next();
          },
        
        
        },

        // ...other sub routes
      ]
    },

    {
      name: "notFound",
      path: "*",
      beforeEnter(to, from, next) {
        console.log('Route not found on SPA. Redirecting to server...')
        next(false); window.location.replace(to.fullPath);
      }
    }
    
  ]
})