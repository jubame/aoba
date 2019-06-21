<template>
  <section data-type="post" v-bind:id="id"
    v-bind:class="dropZoneClass"
        @drag.stop.prevent
        @dragstart.stop.prevent
        @dragover.stop.prevent="drag"
        @dragenter.stop.prevent="drag"
        @dragleave.stop.prevent="drop"
        @dragend.stop.prevent="drop"
        @drop.stop.prevent="drop"
        @drop="dropHandler"
  
    >
    

    
    <img v-bind:src="imgsrc">

    <resizable-textarea @close="closeBody" @push="increasePushes"
    v-for="n in lastEntryID" v-bind:key="n" v-bind:id="n">
    </resizable-textarea>
  </section>
</template>

<script>
import Vue from 'vue'
import ResizableTextarea from './ResizableTextarea'


const initialEntryID = 1

export default {
    
    components: {
        'resizable-textarea': ResizableTextarea,
    },

    data() {
        return {
            lastEntryID: initialEntryID,
            pushes: 0,
            imgsrc: null,
            dragging: false,
            dropping: false
            

        }
    },

    

    computed: {

        id() {
            if (this.$store.state.currentPost !== null){
                return this.$store.state.currentPost.id
            }
        },
        dropZoneClass() {
            if (this.dragging){
                return 'dragging'
            }
            else if (this.dropping){
                return ''
            }
        }

    },

    methods: {




        increasePushes(){
            this.pushes++
        },

        closeBody(event){
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

        drag() {
            this.dragging = true
        },
        drop() {
            this.dragging = false
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
            for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
                this.handleFile(file)
            }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
            }
        }
        },


        handleFile(file) {
       
            
            //if (!file.type.startsWith('image/')){ continue }
            
    
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imgsrc = e.target.result
            
            }

            
            reader.readAsDataURL(file);
        
        }



    }
}


</script>


<style scoped lang="scss">
    [data-type="post"] {
        img {
            width: 20%;
        }
        .dragging {
            background-color: blue;

        }
    }
    
</style>