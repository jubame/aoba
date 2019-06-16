<template>
  <div>
    <resizable-textarea @close="closeBody"
    v-for="n in currBodyID" v-bind:key="n" v-bind:id="currBodyID">
    </resizable-textarea>
  </div>
</template>

<script>
import Vue from 'vue'
import ResizableTextarea from './ResizableTextarea'

const initialBodyID = 1

export default {
    
    components: {
        'resizable-textarea': ResizableTextarea,
    },

    data() {
        return {
            currBodyID: initialBodyID,
        }
    },
    
    methods: {

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