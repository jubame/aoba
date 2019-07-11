<template>
    <div>
        <button @mousedown="createThread">New Thread</button>




        <article data-type="thread" v-bind:id="id"
        v-for="(thread, threadID) in threads" v-bind:key="`thread-${threadID}`"
        >
            
            <regular-post
                v-for="(post, postID) in thread.posts" v-bind:key="`thread-${threadID}-post-${postID}`"
                :newThread="true"
                :threadID="threadID"
                :postID="postID">
            </regular-post>

            <span>{{threadID}}</span>

            
            
            <button v-if="canReply" v-on:click="reply">Reply</button>

            
            
        
        </article>

        
    </div>


</template>

<script>

import NewThreadAccordionPost from './NewThreadAccordionPost'
import Post from './Post'
import {NOT_SET, CLOSED} from '../state'
import {EventBus} from '../main.js'
import {SAVE_RECEIVED_THREAD, NEW_PENDING_THREAD} from '../mutation-types'
import {newThread} from '../js/socket'

export default {
    name: 'Thread',
    
    data () {
        return {
            msg: '今日も一日頑張るぞい！',
            replyPost: false,
            replyPostID: null
            

            
            
            
        }
    },
    created() {

        EventBus.$on('new_thread', 
            (type, content, ids) => {

                console.log('new_thread recibido')

                this.$store.commit(SAVE_RECEIVED_THREAD, {content, ids})
            }
        );



    },

    components: {
        'new-thread-post': NewThreadAccordionPost,
        'regular-post': Post
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
        },

        threads() {
            return this.$store.state.threads
        },

        

        





    },

    methods: {
        reply() {
            this.replyPost = true
        },

        callbackThreadCreated(response){
            console.log('RECIBIDO!!!!')
            console.log('response es ' + response.thread_id.toString())
            console.log('response es ' + response.post_id)
            this.replyPostID = response.post_id


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