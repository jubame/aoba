<template>
    <p>{{entryContent}}</p>
</template>

<script>
export default {

    props: {
        threadID: Number,
        postID: Number,
        entryID: Number,
    },

    computed: {
        entryContent() {
            return this.$store.state.threads[this.threadID].posts[this.postID].entries[this.entryID].content
        }


    }



}
</script>

<style lang="scss">

</style>