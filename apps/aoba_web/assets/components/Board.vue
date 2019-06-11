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

#hello {
  flex: 1;
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>