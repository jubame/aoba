// https://github.com/lorisleiva/vue-lab/tree/master/components/resizable-textarea
import { appendToBodyEntry } from '../js/socket';
<template>
    <section>
        <replied-to-header
        :threadID="this.threadID"
        :postID="this.postID"
        :entryID="this.entryID"
        @show-preview="showPreview"
        ></replied-to-header>
        <div @click="reply">
        <textarea ref="textarea" rows="1" class="resize-none outline-0 h-full"
        :class="repliableClass"
        placeholder="Write something..."
        :disabled="closed"
        @keydown.ctrl.enter="newBody"
        @keydown.ctrl.190.exact="close"
        @compositionstart="compositionStart"
        @compositionend="compositionEnd"
        @focus="aobaOnFocus"
        @blur="aobaOnBlur"
        @input="resizeTextarea"
        :style="textareaStyle"
        v-model="content"
        v-focus
        :id="`${this.threadID}_${this.postID}_${this.entryID}`"
        ></textarea>
        </div>
    </section>
</template>


<script>

//import {newPendingThread, operationToBodyEntry, closeBodyEntry, newPost} from '../js/socket.js'
import {currThread} from '../js/socket.js'
import RepliedToHeaderVue from './RepliedToHeader';
const ENTRY_OPERATION_APPEND = "append"
const ENTRY_OPERATION_REPLACE = "replace"


//window.newThread = newPendingThread

export default {

    //props: ['id', 'threadID', 'postID'],

    props: {
        entryID: Number,
        threadID: Number,
        postID: Number
    },

    components: {
        'replied-to-header': RepliedToHeaderVue,
        
    },


    data() {
        return {
            /* Content se pierde si cambiamos de /board/thread/<thread_id> a /board/threads, 
             * a pesar de que le hemos puesto un key, creo que porque es otro bucle for distinto.
             * Por lo tanto, recargo del store.
             */
            /*
             * Mejor getter del store que computed property con parámetro: 
             *   https://stackoverflow.com/a/40539522
             * The only useful situation is when you have to use a getter and
             * need to have it parametrized. This situation happens in for
             * instance in Vuex. in Vuex it's the only way to synchronously get
             * parametrized result from the store (actions are async). Thus
             * this approach is listed by official Vuex documentation for its
             * getters https://vuex.vuejs.org/guide/getters.html#method-style-access
             */
            content: this.$store.getters.getEntryByID(this.threadID, this.postID, this.entryID, 'content') || '',
            maxWidth: 0,
            interval: null,
            charCount: 0,
            // Input Method Editor (IME): https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/
            isComposing: false,
            lastPushText: '',
            pushes: 0,
            closed: (this.$store.getters.getPostByID(this.threadID, this.postID, 'closed') || false) ||
                    (this.$store.getters.getEntryByID(this.threadID, this.postID, this.entryID, 'closed') || false),
            hasFocus: false,
            
        }
    },


    computed: {

        repliable(){
            return this.$route.name === 'specificThread'
        },

        repliableClass(){
            return this.repliable ? 'repliable' : ''
        },

        

        textareaStyle() {
            return this.$refs.textarea ? 'width:' + (this.$refs.textarea.scrollWidth) + 'px' : ''

        },
        previousTextModified() {
            return this.content.substring(0, this.lastPushText.length) !== this.lastPushText
        },

        currentThread(){
            return this.$store.state.threads[this.threadID]
        },

        currentPost(){
            return this.$store.state.threads[this.threadID].posts[this.postID]
        },



    },


    methods: {

        showPreview() {
            console.log('SHOW-PREVIEW')
        },

        reply(){
            if (this.closed && this.repliable){
                this.$emit('reply', this.entryID)
            }
        },

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
            return {entryID: this.entryID, content: this.content}
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

                
                if (!this.pushes) {
                    this.$store.commit(
                        "NEW_ENTRY",
                        {
                            threadID: this.threadID,
                            postID: this.postID,
                            entryID: this.entryID,
                        }
                    )
                }
                
                if (!(closeEntry || closePost)) {
                    clearInterval(this.interval)
                    this.interval = null
                    return
                }
                else {
                    let serverClientCommonParams = {
                        action: ENTRY_OPERATION_REPLACE,
                        postID: this.postID,
                        entryID: this.entryID,
                        content: this.content,
                    }
                    
                    currThread.operationToBodyEntry(
                        {
                            ...serverClientCommonParams,
                            closeEntry: closeEntry,
                            closePost: closePost
                        }
                    )
                    this.pushes++
                    
                    this.$store.commit(
                        "UPDATE_ENTRY",
                        {
                            ...serverClientCommonParams,
                            threadID: this.threadID,
                        }
                    )

                }
            }
            // No se ha modificado el texto anterior
            else {
            
                var currentCharCount = this.content.length

                // Hay nuevo contenido
                if (currentCharCount > this.charCount && !this.isComposing) {
                    if (this.currentPost.closed){
                        currThread.newPost()
                    }
                    else if (this.postID !== null){
                        // Añadir/concatenar a contenido anterior
                        console.log(this.$parent.id)

                        let serverClientCommonParams = {
                            action: ENTRY_OPERATION_APPEND,
                            postID: this.postID,
                            entryID: this.entryID,
                            content: this.content.substring(this.charCount, currentCharCount),
                        }

                        let serverCommonParams = {
                            ...serverClientCommonParams,
                            closeEntry: closeEntry,
                            closePost: closePost,

                        }

                        if (!this.pushes && this.$store.state.threads[this.threadID].posts[this.postID].entries[this.entryID]) {
                            currThread.operationToBodyEntry(
                                {
                                ...serverCommonParams,
                                replyTo: this.$store.state.threads[this.threadID].posts[this.postID].entries[this.entryID].replyTo
                                }
                            )

                        }
                        else {
                            currThread.operationToBodyEntry(
                                serverCommonParams
                            )
                        }


                        this.$store.commit(
                            "UPDATE_ENTRY",
                            {
                                ...serverClientCommonParams,
                                threadID: this.threadID,

                            }
                        )
                        
                        
                        this.pushes++
                    }
                    
                    this.$emit('push')
                    this.lastPushText = this.content
                    this.charCount = currentCharCount
                }
                /* Si no hay nuevo contenido, sólo queda por comprobar si
                 * estamos cerrando
                 * currentCharCount > 0 porque no hace falta enviar al servidor
                 * el cierre de un entry vacío, puesto que todavía no se ha
                 * enviado.
                 */
                else if ((closeEntry || closePost) && currentCharCount) {
                    // Cierre a secas, sin contenido.
                    currThread.closeBodyEntry(
                            this.postID,
                            this.entryID,
                            closePost
                        )
                    this.$store.commit(
                        "CLOSE_ENTRY",
                        {
                            threadID: this.threadID,
                            postID: this.postID,
                            entryID: this.entryID
                        }

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
        
      
        

        this.maxWidth = Math.min(
            700,
            window.innerWidth-200
        )

    },
    render () {
        return this.$slots.default[0]
    },
}




</script>


<style lang="scss">

    @import "styles/app-no-styles.scss";
    textarea {

        padding: $text-padding;

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
            //background-color: grey;
        }

        display: block;
        overflow-y: hidden;
        overflow-x: hidden;
        resize: none;
        outline: none;
        
        


    }

    [data-type="post"] {
        &.closed {
            textarea:disabled {
                background-color: transparent;
                color: black;
                $border: 1px;
                border: $border solid transparent;
                &.repliable:hover{
                    cursor: pointer;
                    border: $border solid red;
                }
            }
        }
    }



</style>