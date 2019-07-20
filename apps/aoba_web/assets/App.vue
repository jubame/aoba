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
    <hello-world v-if="isThis('/')" ></hello-world>
    <board v-if="isThis('/board')" ></board>

  </div>
</template>

<script>


import Nav from './components/Nav'
import HelloWorld from './components/HelloWorld'
import Board from './components/Board'
import store from './store'
import {DRAG_N_DROP} from './mutation-types'
import {NOT_SET, DRAGENTER, DRAGLEAVE, DROP} from './state'




export default {
  name: 'App',
  store,
  components: {
    'nav-aoba': Nav,
    'hello-world': HelloWorld,
    'board': Board
  },

  methods: {
    isThis(url){
      return this.$route.path === url
    },

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
