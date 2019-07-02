<template>
  <div id="app"
        

        
        @drag.stop.prevent=""
            @dragover.stop.prevent=""
            @dragstart.stop.prevent=""
            @dragend.stop.prevent=""
            @dragenter.stop.prevent="dragEnter"
            @dragleave.stop.prevent="dragLeave"
            @drop.stop.prevent="drop"
 


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
      
      console.log(event.target)
      //if (this.$el === event.target){
      if (this.$store.state.dragging === NOT_SET ||
          this.$store.state.dragging !== DRAGENTER){
        console.log(event.target)
        console.log('DRAGENTER')
        this.$store.commit(DRAG_N_DROP, DRAGENTER)
        
      }
      //}
      
      
    },

    dragLeave(event) {
      console.log(event.target)
      if (this.$el === event.target){
        this.$store.commit(DRAG_N_DROP, DRAGLEAVE)
        console.log('DRAGLEAVE')
      }
    },

    drop() {
      console.log(event.target)
      if (this.$el === event.target){
        console.log(event.target)
        console.log('DROP')
        this.$store.commit(DRAG_N_DROP, DROP)
        
      }
      
    }

  },

  computed: {
    dragging() {
      return this.$store.state.dragging === DRAGENTER ? 'dragging' : ''
    },
  }

}
</script>

<style lang="scss">

#app {
  display: flex;
  height: 100%;

  &.dragging :not([data-type="post"]) {
    pointer-events: none;
  }

  

}
#content {
  flex: 1;
}
</style>
