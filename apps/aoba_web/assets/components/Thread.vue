<template>
    <div>
        <button @mousedown="createThread">New Thread</button>




        <article data-type="thread" v-bind:id="id"
        v-for="thread in newThreads" v-bind:key="`new-thread-${thread.threadPendingID}`"
        >

            
            <regular-post v-for="(post, index) in thread.posts" v-bind:key="`new-thread-post-${index}`" :newThread="true" :post="thread.posts[index]"></regular-post>

            <span>{{id}}</span>

            
            
            <button v-if="canReply" v-on:click="reply">Reply</button>

            <regular-post :newThread="true" :post="null" :replyPost="true"></regular-post>
            
        
        </article>

        <article data-type="thread" v-bind:id="id"
        v-for="thread in receivedThreads" v-bind:key="`received-thread-${thread.thread_id}`"
        >
            <regular-post  :newThread="false" v-for="(post, index) in thread.posts" v-bind:key="`new-thread-post-${index}`" :post="thread.posts[index]"></regular-post>

            <span>{{id}}</span>

            
            
            <button v-if="canReply" v-on:click="reply">Reply</button>

            <regular-post :newThread="true" :post="null" :replyPost="true"></regular-post>
            
        
        </article>
    </div>


</template>

<script>

import NewThreadAccordionPost from './NewThreadAccordionPost'
import Post from './Post'
import {NOT_SET, CLOSED} from '../state'
import {EventBus} from '../main.js'
import {SAVE_RECEIVED_THREAD, NEW_PENDING_THREAD} from '../mutation-types'


export default {
    name: 'Thread',
    
    data () {
        return {
            msg: '今日も一日頑張るぞい！',
            replyPost: false,
            

            
            
            
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

        newThreads() {
            return this.$store.state.newThreads
        },

        receivedThreads() {
            return this.$store.state.receivedThreads
        }

        





    },

    methods: {
        reply() {
            this.replyPost = true
        },

        createThread(){
            this.$store.commit(NEW_PENDING_THREAD)


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