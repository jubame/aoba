<template>
    <div :class="catalogClass">
        
        <regular-post
            v-for="(post, postID) in currentThreadPosts" v-bind:key="`${threadID}_${postID}`"
            :newThread="true"
            :threadID="threadID"
            :postID="parseInt(postID)"
            :replyPostID="parseInt(replyPostID)"
            @reply-to="replyTo"
            :isCatalog="isCatalog"
            >
        </regular-post>

        <span>SHIT{{threadID}}</span>

        <button v-if="canReply" v-on:click="reply">Reply</button>

       
    </div>


</template>

<script>

import NewThreadAccordionPost from './NewThreadAccordionPost'
import Post from './Post'
import {EventBus} from '../main.js'
import {SAVE_REPLY_TO} from '../mutation-types'
import {lobby, currThread} from '../js/socket'

export default {
    name: 'Thread',

    props: {
        threadIDProp: Number,
        isCatalog: Boolean

    },
    
    data () {
        return {
            msg: '今日も一日頑張るぞい！',
            replyPost: false,
            replyPostID: null,
            

            
            
            
        }
    },
    created(){
        console.log('THREAD CREATED')

        EventBus.$on('lobby_joined', () => {
            let threadIDFromURL = parseInt(this.$route.params.id)
            /* Comprobar que estemos en el caso de /board/thread/<thread_id>
             * (this.$route.params.id accesible), no en otro caso como
             * /board/threads o /board/threads?view=catalog
             */
            if (threadIDFromURL){
                console.log('lobby_joined received. Joining thread ' + threadIDFromURL)
                this.$store.state.lobby.changeThread({thread_id: threadIDFromURL})
            }
            
        })

        //lobby.changeThread(this.isCatalog, this.requestThreadCallback)

    },
    mounted(){
        console.log('THREAD MOUNTED')
        //lobby.changeThread(this.isCatalog, this.requestThreadCallback)

    },
    
    beforeRouteUpdate(to, from, next) {
        console.log('FROM ' + from);
        console.log('TO ' + to);
        /* lobby será undefined si la URL es la del hilo cuando arranca la
         * aplicación (por ejemplo, si el usuario escribe la URL o la
         * pega en una pestaña/ventana nueva, que no tenga la aplicación
         * previamente cargada).
         * En App.vue hago un EventBus.$emit('lobby_joined') que capturo
         * en Thread.vue para hacer join al hilo.
         */
        this.$store.state.lobby &&
        this.$store.state.lobby.changeThread({thread_id: to.params.id})
            
            
        next();
    },

    beforeRouteLeave(to, from, next) {
        console.log('FROM ' + from);
        console.log('TO ' + to);
        /* currThread será undefined si la URL es del hilo cuando
         * arranca la aplicación (por ejemplo, si el usuario escribe la URL o
         * la pega) 
         */
        currThread && currThread.leave().receive("ok", () => {
            console.log('Left ' + from.params.id)
        }).receive("error", () => console.log("Unable to leave current thread channel before creating new one"))
            
            
        next();
    },
    

    components: {
        'new-thread-post': NewThreadAccordionPost,
        'regular-post': Post
    },
    computed: {

        catalogClass(){
            return this.isCatalog ? 'catalog' : ''

        },

    
        currentThreadPosts(){
            let posts = this.threadID && this.$store.state.threads[this.threadID] && this.$store.state.threads[this.threadID].posts
            if (this.isCatalog){
                return {'1': posts['1']}
            }
            else {
                return posts
            }
        },

        threadID(){
            return this.threadIDProp || parseInt(this.$route.params.id)

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

        requestThreadCallback(){
            console.log('TODO: request thread')

        },

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
<style lang="scss">
@import "styles/app-no-styles.scss";

.catalog {
    display: inline-block;
    span {
        display: block;
    }
}

[data-type="thread"] {
    :not(.catalog){
        clear: both;
    }
    &.catalog {
        vertical-align: top;
        

    }
}



</style>