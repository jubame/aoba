<template>
    <p :class="status">{{entryContent}}</p>
</template>

<script>

import {OPEN, CLOSED} from '../state'

export default {

    props: {
        threadID: Number,
        postID: Number,
        entryID: Number,
    },

    computed: {
        entryContent() {
            return this.$store.state.threads[this.threadID].posts[this.postID].entries[this.entryID].content
        },
        status() {
            return this.$store.state.threads[this.threadID].posts[this.postID].entries[this.entryID].status === OPEN ? 'open' : 'closed'
        }


    }



}
</script>

<style lang="scss">
    p {
        &.open {
            padding: 2px;
            border: 1px solid green;
            background-color: #EEDBCE;
        }
        &.closed {
            padding: 3px;
        }
    }

</style>