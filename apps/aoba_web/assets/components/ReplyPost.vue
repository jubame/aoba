<template>
  <section class="reply-post" @mousedown="drag._drag_init">

    <header>Reply to thread #{{this.threadID}}</header>
    <post></post>
    

  </section>



</template>

<script>
import Vue from 'vue'
import Post from './Post'

export default {

    components: {
        'post': Post,
    },

    data() {
        return {
            drag: this.$Drag()
        }
    },
    computed: {
        threadID() {
            return this.$store.state.currentThread !== null ?
            this.$store.state.currentThread.id :
            '<no_thread_yet>'
            
        },
    }


}


</script>


<style lang="scss">
/* Atención: aquí el style no es scoped porque pongo los estilos de los hijos
 * a segundo nivel a "pointer-events: auto" (en mi caso lo que esté dentro del
 * componente Post).
 */


.reply-post{
    cursor: move;
    /* https://css-tricks.com/slightly-careful-sub-elements-clickable-things/
     * Sin pointer-events:none para los hijos, event.target es uno de los hijos
     * del section (header o post), y drag no funciona.
     */ 
    > * {
        
        pointer-events: none;
        
        > * {
            pointer-events: auto;
        }
    }
    
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: beige;

    $header-post-padding: 20px;

    header {
        $height: 20px;
        font-size: 10pt;
        height: $height;
        line-height: $height;
        background-color: #98e;
        padding-left: $header-post-padding;
    }

    [data-type="post"] {
        padding: $header-post-padding 0 2*$header-post-padding $header-post-padding;
    }

}




</style>
