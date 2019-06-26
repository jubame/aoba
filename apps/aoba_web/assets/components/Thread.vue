<template>
  <article data-type="thread" v-bind:id="id">


    <component v-bind:is="post"></component>


    <regular-post v-if="this.replyPost"></regular-post>




    <button v-if="this.id" v-on:click="reply">Reply</button>

    
  </article>
</template>

<script>

import NewThreadAccordionPost from './NewThreadAccordionPost'
import Post from './Post'

export default {
    name: 'Thread',
    
    data () {
        return {
            msg: '今日も一日頑張るぞい！',
            replyPost: false
        }
    },

    components: {
        'new-thread-post': NewThreadAccordionPost,
        'regular-post': Post
    },
    computed: {

        id() {
            if (this.$store.state.currentThread !== null){
                return this.$store.state.currentThread.id
            }
        },

        post: function () {
            if (this.$store.thread !== null){
                return 'new-thread-post'
            }
            else{
                return 'regular-post'
            }
        }
    },

    methods: {
        reply() {
            this.replyPost = true
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