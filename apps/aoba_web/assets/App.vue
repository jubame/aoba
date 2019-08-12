<template>
  <div id="app"
        

        
        @drag.prevent=""
            @dragover.prevent=""
            @dragstart.prevent=""
            @dragend.prevent=""
            @dragenter.prevent="dragEnter"
            @dragleave.prevent="dragLeave"
            @drop.prevent="drop"
 


        :class="dragging"
  >

    <nav-aoba ></nav-aoba>
    <router-view></router-view>
  

  </div>
</template>

<script>


import Nav from './components/Nav'
import HelloWorld from './components/HelloWorld'
import Board from './components/Board'
import store from './store'
import {DRAG_N_DROP, SAVE_LOBBY} from './mutation-types'
import {NOT_SET, DRAGENTER, DRAGLEAVE, DROP} from './state'
import {initializeLobby} from './js/socket'




export default {
  name: 'App',
  store,
  components: {
    'nav-aoba': Nav,
    'hello-world': HelloWorld,
    'board': Board
  },

  mounted(){
    let lobby = initializeLobby()
    console.log('APP MOUNT')
    lobby.join()
    .receive("ok", tok => {
      console.log('JOINING')
      lobby.joined(tok)
      this.$store.commit(SAVE_LOBBY, lobby)
    })
    .receive("error", resp => { console.log("Unable to join", resp) })

  },

  methods: {
    

    dragEnter(event){
      
   
      /* IF para mejorar rendimiento cuando pasa de #content a nav o viceversa
       * (de DRAGENTER a DRAGENTER)
       */
      if (this.$store.state.app_dragging !== DRAGENTER){
        this.$store.commit(DRAG_N_DROP, DRAGENTER)
      }
      
      
      
    },

    dragLeave(event) {
      var pageX = event.pageX || event.clientX;
      var pageY = event.pageY || event.clientY;
      if (pageX <=0 || pageY <=0){
        this.$store.commit(DRAG_N_DROP, DRAGLEAVE)
      }
      
    },

    drop() {
      
      
      this.$store.commit(DRAG_N_DROP, DROP)
        
      
      
    }

  },

  computed: {
    dragging() {
      return this.$store.state.app_dragging === DRAGENTER ||
             this.$store.state.post_dragging === DRAGENTER ? 'dragging' : ''
    },
  }

}
</script>

<style lang="scss">

#app {


  

  
  
  &.dragging {
    #content :not([data-type="post"]), nav * {
      pointer-events: none;
    }
  }
  
  



  

}
#content {
  display: table-cell;
}
</style>
