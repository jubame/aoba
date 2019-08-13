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
              console.log('lobby not yet available')
            }
            
            
            next();
          },
        
        
        },

        // ...other sub routes
      ]
    },
    
  ]
})