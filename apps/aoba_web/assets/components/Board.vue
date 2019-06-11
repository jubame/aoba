<template>
  <div id="content">
    <img src="../static/images/aoba_salute.jpg">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Board',
  data () {
    return {
      msg: '今日も一日頑張るぞい！'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#content {

    background-color: #eef2ff;
}



</style>