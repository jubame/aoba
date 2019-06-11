<template>
  <div id="app">

    <nav-aoba></nav-aoba>

    <div id="content">
      <img src="./static/images/aoba_suzukaze.png">
      <router-view/>
    </div>




  </div>
</template>

<script>


import Nav from './components/Nav'


export default {
  name: 'App',
  components: {
    'nav-aoba': Nav
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
