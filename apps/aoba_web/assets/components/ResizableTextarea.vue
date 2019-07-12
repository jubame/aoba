// https://github.com/lorisleiva/vue-lab/tree/master/components/resizable-textarea
import { appendToBodyEntry } from '../js/socket';
<template>
    <textarea rows="1" class="resize-none outline-0 h-full"
      placeholder="Write something..."
      v-bind:disabled="closed"
      @keydown.ctrl.enter="newBody"
      @keydown.ctrl.190.exact="close"
      @compositionstart="compositionStart"
      @compositionend="compositionEnd"
      @focus="aobaOnFocus"
      @blur="aobaOnBlur"
      
    ></textarea>
</template>


<script>

import {newPendingThread, operationToBodyEntry, closeBodyEntry, newPost} from '../js/socket.js'
import {NOT_SET, CLOSED} from '../state'
const ENTRY_OPERATION_APPEND = "append"
const ENTRY_OPERATION_REPLACE = "replace"


//window.newThread = newPendingThread

export default {

    //props: ['id', 'threadID', 'postID'],

    props: {
        id: Number,
        threadID: Number,
        postID: Number
    },


    data() {
        return {
            maxWidth: 0,
            interval: null,
            charCount: 0,
            // Input Method Editor (IME): https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/
            isComposing: false,
            lastPushText: '',
            pushes: 0,
            closed: false,
            hasFocus: false,
            
        }
    },

    computed: {
        previousTextModified() {
            return this.$el.value.substring(0, this.lastPushText.length) !== this.lastPushText
        },

        currentThread(){
            return this.$store.state.threads[this.threadID]
        },

        currentPost(){
            return this.$store.state.threads[this.threadID].posts[this.postID]
        },


    },


    methods: {

        resizeTextarea (event) {
            
            if (event.target.scrollWidth < this.maxWidth){
                
                event.target.style.width = 'auto'
                event.target.style.width = event.target.scrollWidth + 'px'
                
            }
            else{
                // pre-wrap para poder hacer trifuerza sin NBSP
                event.target.style.whiteSpace = "pre-wrap"
                event.target.style.width = this.maxWidth + 'px'
            }

            // Reset the textarea height to auto in order to shrink back to its default size.

            event.target.style.height = 'auto'
            event.target.style.height = (event.target.scrollHeight) + 'px'
            
            
        },

        newBody(event) {
            this.$emit('newbody', event)
        },

        close(event) {
            this.push(true, false)
            this.closed = true
            this.$emit('newbody', event)
            
        },

        closeFromPost(event) {
            this.closed = true
        },


        pushFromPost(){
            this.push(false, true)
        },



        push(closeEntry, closePost){

            /* Se ha modificado el texto anterior: sólo haremos push cuando el
             * usuario cierre el entry, y en ese caso reemplazaremos todo el 
             * entry (no nos preocupamos de lo que hubiese antes).
             */
            if (this.previousTextModified) {
                
                if (!(closeEntry || closePost)) {
                    clearInterval(this.interval)
                    this.interval = null
                    return
                }
                else {
                    operationToBodyEntry(
                        ENTRY_OPERATION_REPLACE,
                        this.threadID,
                        this.postID,
                        this.id,
                        this.$el.value,
                        closeEntry,
                        closePost
                    )
                    this.pushes++

                }
            }
            // No se ha modificado el texto anterior
            else {
            
                var currentCharCount = this.$el.value.length

                // Hay nuevo contenido
                if (currentCharCount > this.charCount && !this.isComposing) {
                    if (this.currentPost.status === CLOSED){
                        newPost(this.threadID, this.id, {"type": "text", "content": this.$el.value})
                    }
                    else if (this.postID !== null){
                        // Añadir/concatenar a contenido anterior
                        console.log(this.$parent.id)
                        
                        operationToBodyEntry(
                            ENTRY_OPERATION_APPEND,
                            this.threadID,
                            this.postID,
                            this.id,
                            this.$el.value.substring(this.charCount, currentCharCount),
                            closeEntry,
                            closePost
                        )
                        this.pushes++
                    }
                    
                    this.$emit('push')
                    this.lastPushText = this.$el.value
                    this.charCount = currentCharCount
                }
                // Si no hay nuevo contenido, sólo queda por comprobar si estamos cerrando
                else if (closeEntry || closePost) {
                    // Cierre a secas, sin contenido.
                    closeBodyEntry(
                            this.threadID,
                            this.postID,
                            this.id,
                            closePost
                        )
                    this.pushes++
                }
            }


        },

        aobaOnFocus: function () {
            this.hasFocus = true
            this.interval = setInterval(
                this.push,
                5000, false, false
            );
        
        },

        aobaOnBlur () {
            this.hasFocus = false
            //alert('FUERA FOCO')
            clearInterval(this.interval)
            this.interval = null
            this.push(false, false)
            
        },

        compositionStart(event) {
            this.isComposing = true
        },
        compositionEnd(event) {
            this.isComposing = false
        }


    },
    mounted () {
        this.$nextTick(() => {
            this.$el.setAttribute('style', 'width:' + (this.$el.scrollWidth) + 'px;')
            
        })
        this.maxWidth = Math.min(
            700,
            window.innerWidth-200
        )

        this.$el.addEventListener('input', this.resizeTextarea)
    },
    beforeDestroy () {
        this.$el.removeEventListener('input', this.resizeTextarea)
    },
    render () {
        return this.$slots.default[0]
    },
}




</script>


<style scoped lang="scss">
    textarea {

        // Esto permite crecer a lo ancho el textarea cuando sólo hay una línea
        white-space: nowrap;
        /* Esto es por el else de resizeTextArea, que cambia style.whitespace a
         * pre-wrap cuando event.target.scrollWidth >= this.maxWidth (else de
         * if (event.target.scrollWidth < this.maxWidth). En estado disabled
         * pierde el style.whitespace pre-wrap, tomando efecto el nowrap que
         * hemos puesto arriba en CSS
         */
        &:disabled {
            // pre-wrap para poder hacer trifuerza sin NBSP
            white-space: pre-wrap;
        }

        display: block;
        overflow-y: hidden;
        overflow-x: hidden;
        resize: none;
        outline: none;
        
        


    }
</style>