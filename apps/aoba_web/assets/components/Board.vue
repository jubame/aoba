<template>
  <div id="content">
    <img src="../static/images/aoba_salute.jpg">
    <new-thread></new-thread>
  </div>
</template>

<script>

import NewThreadAccordion from './NewThreadAccordion'

export default {
    name: 'Board',
    
    data () {
        return {
            msg: '今日も一日頑張るぞい！'
        }
    },

    components: {
        'new-thread': NewThreadAccordion
    },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#content {

    background-color: #eef2ff;
}



</style>