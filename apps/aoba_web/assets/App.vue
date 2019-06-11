<template>
  <div id="app">
    <nav-aoba></nav-aoba>
    <hello-world v-if="isThis('/')"></hello-world>
    <board v-if="isThis('/board')"></board>


  </div>
</template>

<script>


import Nav from './components/Nav'
import HelloWorld from './components/HelloWorld'
import Board from './components/Board'


export default {
  name: 'App',
  components: {
    'nav-aoba': Nav,
    'hello-world': HelloWorld,
    'board': Board
  },

  methods: {
    isThis(url){
      return this.$route.path === url
    }
  }
}
</script>

<style>
#app {
  display: flex;
  height: 100%;
}
#content {
  flex: 1;
}
</style>
