<template>
  <article data-type="thread" v-bind:id="id">


    <component v-bind:is="post"></component>
    <button v-if="this.canReply" v-on:click="reply">Reply</button>

    <reply-post  :replyPost="true"></reply-post>




    

    
  </article>
</template>

<script>

import NewThreadAccordionPost from './NewThreadAccordionPost'
import Post from './Post'
import {NOT_SET, CLOSED} from '../state'
import {EventBus} from '../main.js'


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
        'reply-post': Post
    },
    computed: {

        id() {
            if (this.$store.state.currentThread.status !== NOT_SET){
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
        },

        canReply() {
    
            return this.$store.state.currentThread.status !== NOT_SET &&
            (
                this.$store.state.currentPost.status === CLOSED ||
                this.$store.state.currentPost.status === NOT_SET
            )
        }





    },

    created() {
        EventBus.$on('new_thread', 
            function(type, content, ids){

                console.log('new_thread')
                console.log(type)
                console.log(content)
                console.log(ids)



            }
        );
    },

    methods: {
        reply() {
            this.replyPost = true
        },



    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#content {

    background-color: #eef2ff;
}



</style>