<template>
  <article data-type="thread" v-bind:id="id">


    <component v-bind:is="post"></component>
    
  </article>
</template>

<script>

import NewThreadAccordionPost from './NewThreadAccordionPost'
import Post from './Post'

export default {
    name: 'Thread',
    
    data () {
        return {
            msg: '今日も一日頑張るぞい！'
        }
    },

    components: {
        'new-thread-post': NewThreadAccordionPost,
        'regular-post': Post
    },
    computed: {

        id() {
            if (this.$store.state.currentThread !== null){
                return this.$store.state.currentThread.id
            }
            

        },

        post: function () {
            if (this.$store.thread !== null){
                return 'new-thread-post'
            }
            else{
                return 'regular-post'
            }
        }
    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#content {

    background-color: #eef2ff;
}



</style>