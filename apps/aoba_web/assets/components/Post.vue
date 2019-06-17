<template>
  <section data-type="post">
    <resizable-textarea @close="closeBody" @push="push"
    v-for="n in currBodyID" v-bind:key="n" v-bind:id="n">
    </resizable-textarea>
  </section>
</template>

<script>
import Vue from 'vue'
import ResizableTextarea from './ResizableTextarea'
import {newThread} from '../js/socket.js'
window.newThread = newThread

const initialBodyID = 1

export default {

    props: ['newThread'],
    
    components: {
        'resizable-textarea': ResizableTextarea,
    },

    data() {
        return {
            id: null,
            currBodyID: initialBodyID,
            pushes: 0
            

        }
    },

    methods: {


        push(resizableTextarea){
            if (this.newThread && this.pushes === 0){
                console.log(resizableTextarea.$el.value)
                this.pushes++
                newThread(resizableTextarea.$el.value)



            }

        },

        closeBody(event){
            if (event.target.nextElementSibling === null){
                this.currBodyID++
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
            
        }
    }
}


</script>