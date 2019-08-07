<template>
  <div id="content">
    <img src="../static/images/aoba_salute.jpg">
    <button @mousedown="createThread">New Thread</button>

    <article data-type="thread" :id="threadID" :isCatalog="isCatalog"
        v-for="(thread, threadID) in threads" v-bind:key="`${threadID}`"
        >
        <thread :threadID="parseInt(threadID)"></thread>
    </article>
  </div>
</template>

<script>

import Thread from './Thread'
import {newThread} from '../js/socket'

export default {
    name: 'Board',

    
    
    data () {
        return {
            msg: '今日も一日頑張るぞい！'
        }
    },

    components: {
        'thread': Thread
    },

    computed: {
        threads() {
            return this.$store.state.threads
        },

        isCatalog(){
            return this.$route.params.view === 'catalog'
        }

    },

    methods: {

        createThread(){
            newThread();

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