<template>

        <div >

        <a class="entry-container"
        v-if="replyTo"
        @mouseover="showPreview = true"
        @mouseout="showPreview = false"
        :href="`#${this.threadID}_${replyTo.postID}_${replyTo.entryID}`">
        {{'>>' + replyTo.postID + '.' + replyTo.entryID}}

        <received-entry v-if="showPreview" class="preview"
        :threadID="this.threadID"
        :postID="replyTo.postID"
        :entryID="replyTo.entryID"
        ></received-entry>

        
        </a>

        

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

    .preview {
        
        position: absolute;
        left: 50px;
        top: 0;
        
        background-color: antiquewhite; 
    }


</style>