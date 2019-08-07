<template>
    <div>
        
        <regular-post
            v-for="(post, postID) in currentThread.posts" v-bind:key="`${threadID}_${postID}`"
            :newThread="true"
            :threadID="threadID"
            :postID="parseInt(postID)"
            :replyPostID="parseInt(replyPostID)"
            @reply-to="replyTo"
            >
        </regular-post>

        <span>{{threadID}}</span>

        <button v-if="canReply" v-on:click="reply">Reply</button>

       
    </div>


</template>

<script>

import NewThreadAccordionPost from './NewThreadAccordionPost'
import Post from './Post'
import {NOT_SET, CLOSED} from '../state'
import {EventBus} from '../main.js'
import {SAVE_REPLY_TO} from '../mutation-types'
import {currThread} from '../js/socket'

export default {
    name: 'Thread',

    props: {
        threadID: Number

    },
    
    data () {
        return {
            msg: '今日も一日頑張るぞい！',
            replyPost: false,
            replyPostID: null,
            

            
            
            
        }
    },
    

    components: {
        'new-thread-post': NewThreadAccordionPost,
        'regular-post': Post
    },
    computed: {

        currentThread(){
            return this.$store.state.threads[this.threadID]
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
    
            return this.threadID
        },

        
        

        





    },

    methods: {

        replyTo(originPostID, originEntryID){
            console.log('replyTo ' + originPostID + ' ' + originEntryID)
            console.log('replyPostID ' + this.replyPostID)
            if (!this.replyPostID){
                this.replyTo(originPostID, originEntryID)
            }

            



        },


        reply() {
            currThread.newPost(this.callbackPostCreated)
        },

        replyTo(originPostID, originEntryID){
            currThread.newPost(this.callbackPostCreated, originPostID, originEntryID)
            
        },

        callbackPostCreated(response, originPostID, originEntryID) {
            this.replyPostID = response.postID
            let replyTo
            if (originPostID && originEntryID) {
                replyTo = {postID: originPostID, entryID: originEntryID}
            }
            else {
                replyTo = null
            }
            this.$store.commit(SAVE_REPLY_TO, {threadID: this.threadID, postID: this.replyPostID, entryID: 1, replyTo: replyTo})

        },



    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "styles/app-no-styles.scss";

#content {

    background-color: #eef2ff;
}


</style>