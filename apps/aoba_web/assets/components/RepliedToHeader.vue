<template>

        <div>

        <a
        v-if="replyTo"
        @mouseover="showPreview = true"
        @mouseout="showPreview = false"
        :href="`#${this.threadID}_${replyTo.postID}_${replyTo.entryID}`">
        {{'>>' + replyTo.postID + '.' + replyTo.entryID}}

        
        </a>

        <received-entry v-if="showPreview" id="preview"
        :threadID="this.threadID"
        :postID="replyTo.postID"
        :entryID="replyTo.entryID"
        ></received-entry>

        </div>






    
</template>

<script>
import ReceivedEntry from './ReceivedEntry';


export default {

    name: 'replied-to-header',

    props: {
        entryID: Number,
        threadID: Number,
        postID: Number
    },

    data() {
        return {
            showPreview: false,
        }

    },

    components: {
        'received-entry': ReceivedEntry,
        
    },

    computed: {

    
        replyTo(){
            return this.$store.state.threads[this.threadID].posts[this.postID].entries &&
                   this.$store.state.threads[this.threadID].posts[this.postID].entries[this.entryID] &&
                   this.$store.state.threads[this.threadID].posts[this.postID].entries[this.entryID].replyTo

        },
    
    },

    methods: {
        
        
    }
}

</script>


<style scoped lang="scss">

 

    a {
        font-size: 10pt;
        color: red;
        
    }

    #preview {
        position: relative;
        left: 30px;
        top: 0;
    }


</style>