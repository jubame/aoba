<template>

    <img v-if="!isVideo" v-bind:src="imgsrc" class="media"  :class="imageClass" @click="toggleExpand" >
    <video v-else ref="video" class="media" v-bind="videoAttributes" loop  v-bind:src="imgsrc" :class="imageClass" @click="toggleExpand"></video>

</template>

<script>

export default {

    props: {
        threadID: Number,
        postID: Number,
    },



    data() {
        return {
            imageExpanded: false

            

        }
    },

    computed: {

        currentThread(){
            return this.$store.state.threads[this.threadID]
        },

        currentPost(){
            return this.$store.state.threads[this.threadID].posts[this.postID]
        },


        videoAttributes() {
            return this.imageExpanded ? {'controls': '', 'autoplay': ''} : {}
        },

        imageClass() {
            return this.imageExpanded ? 'expanded' : ''
        },

        isVideo() {
            return this.currentPost.media && this.currentPost.media.mime === 'video/webm'

        },


        imgsrc() {            
            // https://stackoverflow.com/a/40321354
            return this.currentPost.media ?
            URL.createObjectURL(
                new Blob(
                    [this.currentPost.media.buffer],
                    {
                        type : this.currentPost.media.mime
                        }
                )
            ) :
            null
        }
    },

    methods: {
        toggleExpand() {
            this.$refs.video && this.$refs.video.pause()

            
            return (this.imageExpanded = !this.imageExpanded);
        }
    }
}


</script>

<style lang="scss">

    [data-type="post"] {
        $not-expanded-border: 4px;
        $expanded-border: 6px;



        .media {

            max-height: 125px;
            max-width: 125px;
            display: block;
            float: left;
            margin-right: 20px;

            cursor: pointer;
            border: $not-expanded-border solid transparent;
            
        }


        .media:hover {
            border: $not-expanded-border solid grey;

        }

        .media.expanded {
            
            border: $expanded-border solid transparent;
            &:hover {
                border: $expanded-border solid grey;
            }
           
        }

        img.media.expanded {
            max-width: 100%;
            max-height: initial;
        }

        video.media.expanded {
            max-width: none;
            max-height: none;
        }
    }



</style>