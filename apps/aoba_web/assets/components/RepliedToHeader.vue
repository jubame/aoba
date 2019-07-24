<template>
    <span v-if="replyTo">{{replyTo.postID}}.{{replyTo.entryID}}</span>
</template>

<script>


export default {

    props: {
        entryID: Number,
        threadID: Number,
        postID: Number
    },

    computed: {

    
        replyTo(){
            return this.$store.state.threads[this.threadID].posts[this.postID].entries &&
                   this.$store.state.threads[this.threadID].posts[this.postID].entries[this.entryID] &&
                   this.$store.state.threads[this.threadID].posts[this.postID].entries[this.entryID].replyTo

        },




    }
}

</script>


<style scoped lang="scss">
</style>