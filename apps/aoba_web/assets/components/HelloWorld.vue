<template>
  <div id="content">
    <img src="../static/images/aoba_suzukaze.png">
    {{msg}}
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
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
  background-color: #ffe;
}
</style>