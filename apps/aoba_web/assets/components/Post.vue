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

        addBody(){
            


        },

        closeBody(){
            this.currBodyID++
            alert('HOLA desde Post')
        }
    }
}


</script>