<template>

        <div>

        <a class="entry-container"
        v-if="replyTo"
        @mouseover="showPreviewMethod"
        @mouseout="showPreview = false"
        
        :href="`#${this.threadID}_${replyTo.postID}_${replyTo.entryID}`">
        {{'>>' + replyTo.postID + '.' + replyTo.entryID}}

        
            <received-entry v-if="showPreview" class="preview"
            :threadID="this.threadID"
            :postID="replyTo.postID"
            :entryID="replyTo.entryID"
            
            ref="preview"
            ></received-entry>

        
        </a>


        

        

        </div>






    
</template>

<script>
import ReceivedEntry from './ReceivedEntry';
import {isElementInViewport, putElementInViewport} from '../viewport'


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

        showPreviewMethod(){
            if (this.showPreview) {
                return
            }
            this.showPreview = true
            let moveUp
            // https://stackoverflow.com/a/7557433
            this.$nextTick( () => {
                

                this.$refs.preview.$el.style.top = 0
                this.$refs.preview.$el.style.left = 50 + 'px'
                putElementInViewport(this.$refs.preview.$el, document.getElementById('content'))

            })
            
        }




        
        
    }
}

</script>


<style scoped lang="scss">

 

    a {
        font-size: 10pt;
        color: red;
        
    }

    .preview {
        color: initial;
        //visibility: hidden;
        position: absolute;
        left: 50px;
        top: 0;
        
        background-color: antiquewhite; 
    }


</style>