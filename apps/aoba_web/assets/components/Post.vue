<template>
  <section data-type="post" lang="en" :id="`thread-${threadID}_${postID}`"
    v-bind:class="[dragging, postType, closedClass, imageLoadedClass]" @mousedown="dragInit"
        
        @dragenter.stop.prevent="dragEnter"
        @dragleave.stop.prevent="dragLeave"
        @drop="dropHandler"
        @keydown.ctrl.alt.190.exact="close"
        
  
    >
    

    <header>{{this.headerText}}</header>

    <template v-if="imgsrc">
        <img v-if="!isVideo" v-bind:src="imgsrc" class="media" @click="toggleExpand" :class="imageClass" >
        <video v-else ref="video" class="media" v-bind="videoAttributes" loop  v-bind:src="imgsrc" @click="toggleExpand" :class="imageClass"></video>
    </template>
    
    <template v-if="isTypeUser">
    <resizable-textarea
        @newbody="newBody"
        @push="increasePushes"
        v-for="entryID in lastEntryID" v-bind:key="`${threadID}_${postID}_${entryID}`"
        ref="resizableTextarea"
        :threadID="threadID"
        :postID="postID"
        :entryID="parseInt(entryID)"
        @reply="reply"
    >
    </resizable-textarea>
    </template>

    <template v-if="isTypeReceived">
    <received-entry
        v-for="(content, entryID) in currentPost.entries"
        v-bind:key="`${threadID}_${postID}_${entryID}`"
        :threadID="threadID"
        :postID="postID"
        :entryID="parseInt(entryID)"
        :content="content"
        v-on:mousedown.native="reply(entryID)"
        >
    </received-entry>
    </template>

  </section>
</template>

<script>
import Vue from 'vue'
import ResizableTextarea from './ResizableTextarea'
import ReceivedEntry from './ReceivedEntry'
import {addMediaToPost} from '../js/socket.js'
import {closeUserPost} from '../js/socket.js'
import {NOT_SET, CLOSED, DRAGENTER, DRAGLEAVE, DROP} from '../state'
import {SAVE_THREAD, SAVE_LAST_PUSH, CLOSE_POST, SAVE_POST, DRAG_N_DROP, POST_DRAG_N_DROP} from '../mutation-types'
import {EventBus} from '../main.js'
import {USER, RECEIVED} from '../types'



const initialEntryID = 1
const reader = new FileReader();


export default {

    //props: ['newThread', 'replyPost', 'threadID', 'postID'],

    props: {
        threadID: Number,
        postID: Number,
        replyPostID: Number
    },
    
    components: {
        'resizable-textarea': ResizableTextarea,
        'received-entry': ReceivedEntry
    },

    data() {
        return {
            lastEntryID: initialEntryID,
            pushes: 0,
            drag: this.$Drag(),
            imageExpanded: false

            

        }
    },
    mounted: function() {
        
    },
    
    created() {

        //if (!this.newThread) {return}

        EventBus.$on('new_thread', 
            (type, content, ids) => {
                console.log('POST: new_thread')


                //console.log('new_thread')
                this.receivedThreadID = ids.thread_id
                this.receivedPostID = ids.post_id
                this.receivedEntries = [{'entry_id': ids.entry_id, 'content': content}]
                console.log(type)
                console.log(content)
                console.log(ids)
            }
        );


        


    },
    

    computed: {

        videoAttributes() {
            return this.imageExpanded ? {'controls': '', 'autoplay': ''} : {}
        },

        imageClass() {
            return this.imageExpanded ? 'expanded' : ''
        },

        isVideo() {
            return this.currentPost.media.mime === 'video/webm'

        },

        isTypeUser(){
            return this.$store.state.threads[this.threadID].posts[this.postID].type === USER
        },
        isTypeReceived(){
            return this.$store.state.threads[this.threadID].posts[this.postID].type === RECEIVED
        },

        currentThread(){
            return this.$store.state.threads[this.threadID]
        },

        currentPost(){
            return this.$store.state.threads[this.threadID].posts[this.postID]
        },


        post_entries() {
            return this.post !== undefined ? this.post.entries : []
        },

        dragging() {
            return this.isTypeUser &&
                   (this.$store.state.app_dragging === DRAGENTER ||
                   this.$store.state.post_dragging === DRAGENTER) ? 'dragging' : ''
        },
        postType() {
            let className
            if (this.isTypeReceived || (this.isTypeUser && this.closed)) {
                className = 'initial-post'
            }
            else if (this.isTypeUser && !this.closed){
                className = 'reply-post'
            }
            else {
                className = ''
            }
            return className
        },
        closed() {
            return this.$store.state.threads[this.threadID].posts[this.postID].status === CLOSED
        },
        headerText() {
            return this.isTypeUser && !this.closed ? 
                'Reply to thread ' + this.threadID + ' - ' + 'Post #' + this.postID :
                'Post #' + this.postID
        },
        closedClass() {

            return this.closed ? 'closed' : ''

        },

        imageLoadedClass() {
            return this.imgsrc !== null ? 'image-loaded' : ''
        },

        imgsrc() {            
            // https://stackoverflow.com/a/40321354
            return this.currentPost.media ?
            URL.createObjectURL(
                new Blob(
                    [this.currentPost.media.buffer],
                    {
                        type : this.currentPost.media.mime
                        }
                )
            ) :
            null
        }

    },

    methods: {

        reply(entryID) {
            console.log("SHIT")

            console.log ('REPLY ' + this.replyPostID )
            this.$emit('reply-to', this.postID, entryID)

        },


        checkNewThread(){
            console.log('newThread es ' + this.newThread)
            console.log('replyPost es ' + this.replyPost)
            console.log('post es ' + this.post)

        },

        dragInit(ev) {
            console.log('dragInit')
            if (this.isTypeUser){
                this.drag._drag_init(ev)
            }
        },


        dragEnter(event){
            
            console.log('POST_DRAGENTER')
            console.log(event.target)
            this.$store.commit(POST_DRAG_N_DROP, DRAGENTER)
        },

        dragLeave(event) {
            console.log('POST_DRAGLEAVE')
            if (this.$el === event.target){
                this.$store.commit(POST_DRAG_N_DROP, DRAGLEAVE)
                
            }
        },



        increasePushes(){
            this.pushes++
        },

        newBody(event){
            if (event.target.nextElementSibling === null){
                this.lastEntryID++
            }
            
        },

        close(ev) {
            
            if (!this.postID){
                return
            }
            let pendingOpenEntry = this.$refs.resizableTextarea.find(
                (entry) => entry.hasFocus
            )

            pendingOpenEntry.pushFromPost()

            
            this.$refs.resizableTextarea.forEach(
                function(entry, index) {
                    entry.closeFromPost()
                }
            )

            closeUserPost(this.threadID, this.postID);



        },


        //https://www.tohuandkonsome.site/entry/2018/01/22/223224#onDropの処理を書く
        //https://stackoverflow.com/questions/44842247/event-datatransfer-files-vs-event-datatransfer-items
        //https://stackoverflow.com/questions/28370240/when-dragging-and-dropping-a-file-the-datatransfer-items-property-is-undefined
        dropHandler(ev) {
            console.log('File(s) dropped');
            this.$store.commit(POST_DRAG_N_DROP, DROP)

            // Prevent default behavior (Prevent file from being opened)
            ev.preventDefault();

            if (ev.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[0].kind === 'file') {
                    var file = ev.dataTransfer.items[0].getAsFile();
                    console.log('... file[' + 0 + '].name = ' + file.name);
                    this.handleFile(file)
                }
                
            } else {
                // Use DataTransfer interface to access the file(s)
                console.log('... file[' + 0 + '].name = ' + ev.dataTransfer.files[0].name);
                
            }
        },


        handleFile(file, as) {
            //if (!file.type.startsWith('image/')){ continue }
            reader.readAsArrayBuffer(file);


            reader.onload = (e) => { // Closure variable as

                let arrayBuffer = e.target.result
                
                this.$emit('imageLoaded')
                
                
                addMediaToPost(
                    this.threadID,
                    this.postID,
                    arrayBuffer
                )

                

                
                
            }
            

        },

        toggleExpand() {
            this.$refs.video.pause()

            
            return (this.imageExpanded = !this.imageExpanded);
        }


        



    }
}


</script>


<style lang="scss">

    @import "styles/app-no-styles.scss";


    [data-type="post"]:not(:first-child) {
        &.initial-post {
            /* https://stackoverflow.com/a/5587563
             * Magia de overflow hidden: Block Formatting Context para hacer
             * espacio al float (la imagen).
             */
            overflow: hidden;
        }
    }



    [data-type="post"] {
        pointer-events: initial;
        display: inline-block;

        $header-post-padding: 20px;

        background-color: $lavendar;

        
        &.initial-post {
            display: block;
            &.image-loaded {
                background-color: transparent;
            }
            overflow: visible;

            .media {
                max-height: 250px;
                max-width: 250px;
            }
        }

        $not-expanded-border: 4px;
        $expanded-border: 6px;

        .media {
            cursor: pointer;
            border: $not-expanded-border solid transparent;
            
        }
        .media:hover {
            border: $not-expanded-border solid grey;

        }

        .media.expanded {
            
            border: $expanded-border solid transparent;
            &:hover {
                border: $expanded-border solid grey;
            }
           
        }

        img.media.expanded {
            max-width: 100%;
            max-height: initial;
        }

        video.media.expanded {
            max-width: none;
            max-height: none;
        }

        &.reply-post {
            cursor: move;
            * {
                pointer-events: none;
            }
            video {
                pointer-events: auto;
                cursor: auto;
            }
            section {
                
                /* https://css-tricks.com/slightly-careful-sub-elements-clickable-things/
                * Sin pointer-events:none para los hijos, event.target es uno de los hijos
                * del section (header o post), y drag no funciona.
                */ 
                
                header, textarea {
                    pointer-events: auto;
                    cursor: auto;
                }
            }
            
            position: absolute;
            right: 0;
            bottom: 0;
            background-color: beige;

            

        }

        

        &.closed {
            textarea:disabled {
                background-color: transparent;
                color: black;
                border: none;
            }
        }



        
        padding: $header-post-padding;
                
        overflow: hidden;
        
        .media {

            max-height: 125px;
            max-width: 125px;
            display: block;
            float: left;
            margin-right: 20px;
            
        }

        header {
            $height: 20px;
            font-size: 10pt;
            height: $height;
            line-height: $height;
            background-color: #98e;
            margin: (-$header-post-padding) (-$header-post-padding) $header-post-padding (-$header-post-padding);
            padding: 0 $header-post-padding;

        }

        > p {
            font-family: monospace;
            font-weight: 400;
            font-size: 10pt;

        }


        

        &.dragging {
            background-color: rgb(118, 118, 180);
            //min-height: 150px;

            &:before{
                content: "Drop your image here";
                font-size: xx-large;
                position: relative;
                display: block;
                text-align: center;
                color: white;
            }

            

        }
    }
    
</style>