<template>
  <section data-type="post" lang="en" :id="`thread-${threadID}_${postID}`"
    v-bind:class="[dragging, postType, closedClass, imageLoadedClass]" @mousedown="dragInit"
        
        @dragenter.stop.prevent="dragEnter"
        @dragleave.stop.prevent="dragLeave"
        @drop="dropHandler"
        @keydown.ctrl.alt.190.exact="close"
        
  
    >
    

    <header><a :href="threadLink">{{this.headerText}}</a></header>
    
    <template v-if="isTypeUser && !closed">
    <p>Press Ctrl + dot to send subpost</p>
    <p>Press Ctrl + Alt + dot to close post</p>
    </template>

    <template v-if="isCatalog">
        <media v-if="isThereMedia" :threadID="threadID" :postID="postID"></media>
    </template>
    <template v-else>
        <media v-if="isThereMedia" :threadID="threadID" :postID="postID"></media>
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
        @reply="reply"
        >
    </received-entry>
    </template>

  </section>
</template>

<script>
import Vue from 'vue'
import ResizableTextarea from './ResizableTextarea'
import ReceivedEntry from './ReceivedEntry'
import Media from './Media'
import {currThread} from '../js/socket.js'
import {DRAGENTER, DRAGLEAVE, DROP} from '../state'
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
        replyPostID: Number,
        isCatalog: Boolean
    },
    
    components: {
        'resizable-textarea': ResizableTextarea,
        'received-entry': ReceivedEntry,
        'media': Media
    },

    data() {
        return {
            lastEntryID: initialEntryID,
            pushes: 0,
            drag: this.$Drag(),

            

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
        

        threadLink(){
            return '/#/board/thread/' + this.threadID
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
            if (this.isCatalog) {
                className = ''
            }
            else if (this.isTypeReceived || (this.isTypeUser && this.closed)) {
                className = 'regular-post'
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
            return this.$store.state.threads[this.threadID].posts[this.postID].closed
        },
        headerText() {
            if (this.isTypeUser && !this.closed){
                return `Reply to thread #${this.threadID} - Post §${this.postID}`
            }
            else if (this.postID === 1){
                return `#${this.threadID}`
            }
            else {
                return `§${this.postID}`
            }
            
                 
                
        },
        closedClass() {

            return this.closed ? 'closed' : ''

        },

        imageLoadedClass() {
            return this.imgsrc !== null ? 'image-loaded' : ''
        },

        isThereMedia(){
            return this.currentPost.media
        }

        

    },

    methods: {

        reply(entryID) {
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

            let entries = {}
            this.$refs.resizableTextarea.forEach(
                
                function(entry, index) {
                    let reply = entry.closeFromPost()
                    entries[reply.entryID] = reply.content
                }









            )

            console.log(entries)




            currThread.closeUserPost(this.postID, entries);



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
                
                
                currThread.addMediaToPost(
                    this.postID,
                    arrayBuffer
                )

                

                
                
            }
            

        },
        

        


        



    }
}


</script>


<style lang="scss">

    @import "styles/app-no-styles.scss";

    $height: 20px;

    /*
     * Tipo de post:
     *   .regular-post: post "normal" que sigue el flujo del documento (salvo
     *                  por la imagen del primer post, que es float)
     *   .reply-post:   post en modo de edición antes de cerrarlo. Se puede
     *                  arrastrar por la pantalla. Al cerrarlo se convierte en
     *                  .regular-post.
     */

    [data-type="post"] {
        pointer-events: initial;
        display: inline-block;

        &:first-child {
            header {
                background-color: darkcyan;
                
                text-align: left;
                a {
                    color: white;
                }
            }
        }


        &:not(:first-child) {
            &.regular-post {

                &:after {
                    content: ".";
                    display: block;
                    height: 0;
                    clear: both;
                    visibility: hidden;
                }

                /* https://stackoverflow.com/a/5587563
                * Magia de overflow hidden: Block Formatting Context para hacer
                * espacio al float (la imagen).
                *
                * No puedo poner "overflow: hidden" aquí en el post porque luego al 
                * mostrar preview del reply en RepliedToHeader se recorta si es
                * muy alto. Tampoco puedo dejar sólo "overflow-x: hidden" porque
                * entonces overflow-y se pone automáticamente con scroll, y no
                * quiero eso.
                */
                header {
                    overflow: hidden;
                    text-align: right;
                    
                }
                
            }
        }

        


        
        /* 
         * No puedo poner padding derecho porque luego necesito margen izquierdo
         * negativo en el header para cubrir todo el ancho de la pantalla, y es
         * ignorado al tener también "overflow: hidden", quizá por esto:
         *     https://bugs.chromium.org/p/chromium/issues/detail?id=350473
         */
        padding: $header-post-padding 0 $header-post-padding $header-post-padding;
        > section {
            margin-right: $header-post-padding;
        }

        background-color: $lavendar;

        
        &.regular-post {
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

        
        /*
        
        */


        
        
        
        
        

        header {
            
            font-size: 10pt;
            height: $height;
            line-height: $height;
            background-color: #98e;
            margin: (-$header-post-padding) 0 $header-post-padding (-$header-post-padding);
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