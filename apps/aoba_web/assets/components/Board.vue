<template>
  <div id="content">
    <img src="../static/images/aoba_salute.jpg">
    <button @mousedown="createThread">New Thread</button>
    <a href="/#/board/threads?view=catalog">Catalog</a>

    <router-view></router-view>
  </div>
</template>

<script>

import Thread from './Thread'
import {newThread} from '../js/socket'

export default {
    name: 'Board',

    methods: {

        callbackThreadCreated(threadID){
            console.log('DESDE BOARD thread_id es: ' + threadID)
            this.$router.push({ name: 'specificThread', params: { id: threadID }})


        },

        createThread(){
            newThread(this.callbackThreadCreated);

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