<template>
    <div>

    <p>This Thread list view does not update automatically. Reload the page to load new threads, then click the green header #thread_id link to enter the live thread.</p>

    <article data-type="thread" :id="threadID" 
        v-for="(thread, threadID) in threads" v-bind:key="`${threadID}`"
        :class="catalogClass"
        >
        <thread :threadIDProp="parseInt(threadID)" :isCatalog="isCatalog"></thread>
    </article>
    </div>
</template>

<script>

import Thread from './Thread'

export default {
    name: 'Threads',

    
    
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

        catalogClass(){
            return this.isCatalog ? 'catalog' : ''

        },

        isCatalog(){
            return this.$route.query.view === 'catalog'
        }

    },

    


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#content {

    background-color: #eef2ff;
}



</style>