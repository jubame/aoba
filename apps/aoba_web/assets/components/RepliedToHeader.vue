<template>
    <!--<span v-if="replyTo">{{'>>' + replyTo.postID + '.' + replyTo.entryID}}</span>-->
    <a v-if="replyTo" :href="`#${this.threadID}_${this.postID}_${this.entryID}`">{{'>>' + replyTo.postID + '.' + replyTo.entryID}}</a>
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
    span {
        font-size: 10pt;
        color: red;
    }
</style>