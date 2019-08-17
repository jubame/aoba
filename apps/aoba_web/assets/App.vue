<template>
  <div id="app"
        

        
        @drag.prevent=""
            @dragover.prevent=""
            @dragstart.prevent=""
            @dragend.prevent=""
            @dragenter.prevent="dragEnter"
            @dragleave.prevent="dragLeave"
            @drop.prevent="drop"
 


        :class="[blockedClass, dragging]"
  >

    <p id="backdrop-message" v-if="blocked">{{blockedMessage}}</p>
    <nav-aoba ></nav-aoba>
    <router-view></router-view>
  

  </div>
</template>

<script>

/*
 * bind de class con varias clases arriba en el template: 
 * https://forum.vuejs.org/t/how-to-bind-the-multiple-class-in-vue2/21626/2
 * https://vuejs.org/v2/guide/class-and-style.html#Array-Syntax
 */


import Nav from './components/Nav'
import HelloWorld from './components/HelloWorld'
import Board from './components/Board'
import store from './store'
import {DRAG_N_DROP, SAVE_LOBBY} from './mutation-types'
import {NOT_SET, DRAGENTER, DRAGLEAVE, DROP} from './state'
import {initializeLobby} from './js/socket'
import {EventBus} from './main.js'




export default {
  name: 'App',
  store,
  components: {
    'nav-aoba': Nav,
    'hello-world': HelloWorld,
    'board': Board
  },

  data(){
    return {
      blocked: true,
      blockedMessage: 'Waiting for created() lifecycle...'

    }
  },

  created(){
    this.blockedMessage='Initializing lobby...'
    let lobby = initializeLobby()
    console.log('APP CREATED')
    this.blockedMessage='Joining lobby...'
    lobby.join()
    .receive("ok", tok => {
      this.blockedMessage='Joined lobby.'
      console.log('Joined lobby.')
      lobby.joined(tok)
      this.$store.commit(SAVE_LOBBY, lobby)
      this.blocked = false
      EventBus.$emit('lobby_joined')
    })
    .receive("error", resp => { console.log("Unable to join", resp) })

  },

  mounted(){
    console.log('APP MOUNTED')
  },

  methods: {
    

    dragEnter(event){
      
   
      /* IF para mejorar rendimiento cuando pasa de #content a nav o viceversa
       * (de DRAGENTER a DRAGENTER)
       */
      if (this.$store.state.app_dragging !== DRAGENTER){
        this.$store.commit(DRAG_N_DROP, DRAGENTER)
      }
      
      
      
    },

    dragLeave(event) {
      var pageX = event.pageX || event.clientX;
      var pageY = event.pageY || event.clientY;
      if (pageX <=0 || pageY <=0){
        this.$store.commit(DRAG_N_DROP, DRAGLEAVE)
      }
      
    },

    drop() {
      
      
      this.$store.commit(DRAG_N_DROP, DROP)
        
      
      
    }

  },

  computed: {

    blockedClass() {
      return this.blocked ? 'blocked' : ''
    },

    dragging() {
      return this.$store.state.app_dragging === DRAGENTER ||
             this.$store.state.post_dragging === DRAGENTER ? 'dragging' : ''
    },
  }

}
</script>

<style lang="scss">
@import "styles/app-no-styles.scss";

#app {

  

  &.blocked {

    // https://tympanus.net/codrops/2013/11/07/css-overlay-techniques/
    &:after {
        content: "";
        display: block;
        position: fixed; /* could also be absolute */ 
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 9;
        background-color: $main-background-color;
        animation-name: backdrop-message;
        /* Si la conexión con el lobby tarda menos de 300ms no merece la pena
         * mostar nada al usuario ni empezar la animación.
         */
        animation-delay: 300ms;
        animation-duration: 1s;
        animation-fill-mode: forwards;


    }

    @keyframes backdrop-message {
      from{ background-color: $main-background-color;}
      to { background-color: rgb(90, 24, 24); }
    }


    #backdrop-message{
        position: fixed; /* could also be absolute */
        color: white;
        top: 50%;
        left: 50%;
        height: 100%;
        width: 100%;
        z-index: 10;

      }

  }

  


  

  
  
  &.dragging {
    #content :not([data-type="post"]), nav * {
      pointer-events: none;
    }
  }
  
  



  

}
#content {
  margin-left: $nav-width;
  height: 100%;
}
</style>
