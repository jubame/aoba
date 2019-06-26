<template>
  <section data-type="post" lang="en" v-bind:id="id"
    v-bind:class="[dropZoneClass, postType]" @mousedown="drag._drag_init" @mousemove="drag._move_elem" @mouseup="drag._drag_destroy"
        
        @drop="dropHandler"
        @keydown.ctrl.alt.190.exact="close"
  
    >
    

    
    <img v-bind:src="imgsrc">

    <resizable-textarea @newbody="newBody" @push="increasePushes"
    v-for="n in lastEntryID" v-bind:key="n" v-bind:id="n" ref="resizableTextarea">
    </resizable-textarea>
  </section>
</template>

<script>
import Vue from 'vue'
import ResizableTextarea from './ResizableTextarea'
import {addMediaToPost} from '../js/socket.js'


const initialEntryID = 1
const reader = new FileReader();


export default {

    props: ['newThread'],
    
    components: {
        'resizable-textarea': ResizableTextarea,
    },

    data() {
        return {
            lastEntryID: initialEntryID,
            pushes: 0,
            imgsrc: null,
            drag: this.$Drag()

            

        }
    },
    mounted: function() {
        
    },

    

    computed: {

        id() {
            if (this.$store.state.currentPost !== null){
                return this.$store.state.currentPost.id
            }
        },
        dropZoneClass() {
            return this.$store.state.dragging ? 'dragging' : ''
        },
        postType() {
            return this.newThread ? 'initial-post' : 'regular-post'
        }

    },

    methods: {




        increasePushes(){
            this.pushes++
        },

        newBody(event){
            if (event.target.nextElementSibling === null){
                this.lastEntryID++
            }
            // https://forum.vuejs.org/t/setting-focus-to-textarea-not-working/17891
            // vue.esm.js:629 [Vue warn]: Error in v-on handler: "TypeError: Cannot read property 'focus' of null"
            this.$nextTick(
                // https://www.jstips.co/en/javascript/passing-arguments-to-callback-functions/
                function callback(event) {
                    return function(){
                        console.log(event)
                        event.target.nextElementSibling.focus()
                    }
                }(event)
            
            )
            
        },

        close(ev) {
            
            if (!this.id){
                return
            }
            let pendingOpenEntry = this.$refs.resizableTextarea.find(
                (entry) => entry.hasFocus
            )

            pendingOpenEntry.closeFromPost()


        },


        //https://www.tohuandkonsome.site/entry/2018/01/22/223224#onDropの処理を書く
        //https://stackoverflow.com/questions/44842247/event-datatransfer-files-vs-event-datatransfer-items
        //https://stackoverflow.com/questions/28370240/when-dragging-and-dropping-a-file-the-datatransfer-items-property-is-undefined
        dropHandler(ev) {
            console.log('File(s) dropped');

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
                // https://stackoverflow.com/a/40321354
                this.imgsrc = URL.createObjectURL(new Blob([arrayBuffer]));
                
                if (this.pushes === 0){
                    newThread({"type": "media", "content": arrayBuffer}, this.id)
                }
                else {
                    addMediaToPost(
                        this.$store.state.currentThread.id,
                        this.$store.state.currentPost.id,
                        arrayBuffer
                    )

                }

                
                
            }
            

        },


        



    }
}


</script>


<style scoped lang="scss">
    [data-type="post"] {

        &.regular-post {
            position: absolute;
            top: 0;
            left: 0;
            background-color: beige;

        }
        
        overflow: hidden;
        padding: 20px;
        img {
            width: 20%;
            min-width: 200px;
            display: block;
            float: left;
            margin-right: 20px;
            
        }


        

        .dragging {
            background-color: rgb(118, 118, 180);
            min-height: 150px;

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