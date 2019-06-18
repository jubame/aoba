<template>
  <section data-type="post" v-bind:id="id">
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
            pushes: 0
            

        }
    },

    computed: {

        id() {
            if (this.$store.state.currentPost !== null){
                return this.$store.state.currentPost.id
            }
            

        },

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
            
        }
    }
}


</script>