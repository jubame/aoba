// https://github.com/lorisleiva/vue-lab/tree/master/components/resizable-textarea
import { appendToBodyEntry } from '../js/socket';
<template>
    <textarea rows="1" class="resize-none outline-0 h-full"
      placeholder="Write something..."
      v-bind:disabled="closed"
      @keydown.ctrl.enter="newBody"
      @keydown.ctrl.190="close"
      @compositionstart="compositionStart"
      @compositionend="compositionEnd"
      @focus="aobaOnFocus"
      @blur="aobaOnBlur"
      
    ></textarea>
</template>


<script>

import {newThread, operationToBodyEntry, closeBodyEntry} from '../js/socket.js'
const ENTRY_OPERATION_ADD = "add"
const ENTRY_OPERATION_APPEND = "append"
const ENTRY_OPERATION_APPEND_CLOSE = "append_close"
const ENTRY_CLOSE = "ENTRY_CLOSE"
const ENTRY_OPERATION_REPLACE = "replace"


window.newThread = newThread

export default {

    props: ['id'],



    data() {
        return {
            maxWidth: 0,
            interval: null,
            charCount: 0,
            // Input Method Editor (IME): https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/
            isComposing: false,
            lastPushText: '',
            closed: false
        }
    },


    methods: {

        resizeTextarea (event) {
            
            if (event.target.scrollWidth < this.maxWidth){
                
                event.target.style.width = 'auto'
                event.target.style.width = event.target.scrollWidth + 'px'
                
            }
            else{
                
                event.target.style.whiteSpace = "pre-line"
                event.target.style.width = this.maxWidth + 'px'
            }

            // Reset the textarea height to auto in order to shrink back to its default size.

            event.target.style.height = 'auto'
            event.target.style.height = (event.target.scrollHeight) + 'px'
            
            
        },

        newBody() {
            this.$emit('newbody', event)
        },

        close(event) {
            this.push(true)
            this.closed = true
            this.$emit('newbody', event)
        },

        push(close){

            if (this.$el.value.substring(0, this.lastPushText.length) !== this.lastPushText) {
                return
            }
            
            var currentCharCount = this.$el.value.length

            if (currentCharCount > this.charCount && !this.isComposing) {



                if (this.$parent.pushes === 0){
                    console.log(this.$el.value)
                    newThread({"type": "text", "content": this.$el.value}, this.id)
                }
                else if (this.$parent.pushes > 0 && this.$store.state.currentPost.id !== null){
                    console.log(this.$parent.id)
                    let action = close ? ENTRY_OPERATION_APPEND_CLOSE : ENTRY_OPERATION_APPEND
                    operationToBodyEntry(
                        action,
                        this.$store.state.currentThread.id,
                        this.$store.state.currentPost.id,
                        this.id,
                        this.$el.value.substring(this.charCount, currentCharCount)
                    )
                }
                
                this.$emit('push')
                this.lastPushText = this.$el.value
                this.charCount = currentCharCount
            }
            else if (close) {
                closeBodyEntry(
                        this.$store.state.currentThread.id,
                        this.$store.state.currentPost.id,
                        this.id
                    )
            }


        },

        aobaOnFocus: function () {
            this.interval = setInterval(
                this.push,
                5000, false
            );
        
        },

        aobaOnBlur () {
            //alert('FUERA FOCO')
            clearInterval(this.interval)
            this.interval = null
            this.push(false)
            
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
        display: block;
        overflow-y: hidden;
        overflow-x: hidden;
        resize: none;
        vertical-align: baseline;
        outline: none;
        white-space: nowrap;

    }
</style>