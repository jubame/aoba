<template>
  <section class="reply-post" @mousedown="drag._drag_init">

    <header>Reply to thread #</header>
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
    top: 0;
    left: 0;
    background-color: beige;
}




</style>
