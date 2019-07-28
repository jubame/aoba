<template>
    <section>
    <replied-to-header
        :threadID="this.threadID"
        :postID="this.postID"
        :entryID="this.entryID"
    ></replied-to-header>
    <p :class="status" :id="`${this.threadID}_${this.postID}_${this.entryID}`" @click="reply">{{entryContent}}</p>
    </section>
</template>

<script>

import {OPEN, CLOSED} from '../state'
import RepliedToHeaderVue from './RepliedToHeader';


export default {

    props: {
        threadID: Number,
        postID: Number,
        entryID: Number,
    },

    components: {
        'replied-to-header': RepliedToHeaderVue,
        
    },

    computed: {
        entryContent() {
            return this.$store.state.threads[this.threadID].posts[this.postID].entries[this.entryID].content
        },
        status() {
            if (this.$store.state.threads[this.threadID].posts[this.postID].status === CLOSED){
                return 'closed'
            } else if (this.$store.state.threads[this.threadID].posts[this.postID].entries[this.entryID].status === CLOSED) {
                return 'closed'
            } else {
                return 'open'
            }
        }


    },

    methods: {
        reply(){
            
            this.$emit('reply', this.entryID)
            
        },
    }



}
</script>

<style scoped lang="scss">
    @import "styles/app-no-styles.scss";
    p {
        white-space: pre-wrap;
        font-family: monospace;
        font-size: 10pt;
        padding: $text-padding;
        margin: 0;
        &.open {
            padding: 2px;
            border: 1px solid green;
            background-color: #EEDBCE;
        }
        &.closed {
            padding: 3px;
        }

        $border: 1px;
        border: $border solid transparent;
        &:hover {
            cursor: pointer;
            border: $border solid red;
        }
    }

</style>