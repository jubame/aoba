<template>
  <div id="app"
        @drag.stop.prevent
        @dragstart.stop.prevent
        @dragover.stop.prevent="drag"
        @dragenter.stop.prevent="drag"
        @dragleave.stop.prevent="drop"
        @dragend.stop.prevent="drop"
        @drop.stop.prevent="drop"
  >
    <nav-aoba></nav-aoba>
    <hello-world v-if="isThis('/')"></hello-world>
    <board v-if="isThis('/board')"></board>


  </div>
</template>

<script>


import Nav from './components/Nav'
import HelloWorld from './components/HelloWorld'
import Board from './components/Board'
import store from './store'
import {DRAG, DROP} from './mutation-types'




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

    drag(){
      this.$store.commit(DRAG)
    },

    drop() {
      this.$store.commit(DROP)
    }

  },
}
</script>

<style lang="scss">

#app {
  display: flex;
  height: 100%;
}
#content {
  flex: 1;
}
</style>
