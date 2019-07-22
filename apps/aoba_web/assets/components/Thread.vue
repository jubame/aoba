<template>
    <div>
        <button @mousedown="createThread">New Thread</button>




        <article data-type="thread" :id="threadID"
        v-for="(thread, threadID) in threads" v-bind:key="`${threadID}`"
        >
            
            <regular-post
                v-for="(post, postID) in thread.posts" v-bind:key="`${threadID}_${postID}`"
                :newThread="true"
                :threadID="parseInt(threadID)"
                :postID="parseInt(postID)"
                :replyPostID="parseInt(replyPostID)"
                >
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
import {newThread, newPost} from '../js/socket'

export default {
    name: 'Thread',
    
    data () {
        return {
            msg: '今日も一日頑張るぞい！',
            replyPost: false,
            replyPostID: null,
            threadID: null
            

            
            
            
        }
    },
    created() {

        EventBus.$on('new_thread', 
            (threadID, postID) => {

                console.log('new_thread recibido')

                this.$store.commit(SAVE_RECEIVED_THREAD, {threadID, postID})
                this.threadID = threadID
            }
        );



    },

    components: {
        'new-thread-post': NewThreadAccordionPost,
        'regular-post': Post
    },
    computed: {


        post: function () {
            if (this.$store.thread !== null){
                return 'new-thread-post'
            }
            else{
                return 'regular-post'
            }
        },

        canReply() {
    
            return this.threadID
        },

        threads() {
            return this.$store.state.threads
        },

        

        





    },

    methods: {
        reply() {
            newPost(this.threadID, this.callbackPostCreated)
        },

        callbackPostCreated(response) {
            this.replyPostID = response.postID

        },

        callbackThreadCreated(response){
            console.log('RECIBIDO!!!!')
            console.log('response es ' + response.thread_id)
            console.log('response es ' + response.post_id)
            this.threadID = response.thread_id


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