<template>
  <div id="content" :class="navCollapsedClass">
    <!-- <img src="../static/images/aoba_salute.jpg"> -->
    <button @mousedown="createThread">New Thread</button>
    <a href="/#/board/threads?view=catalog">Catalog</a>

    <router-view></router-view>
  </div>
</template>

<script>

import Thread from './Thread'
import {lobby} from '../js/socket'

export default {
    name: 'Board',

    computed: {
        navCollapsedClass() {
            return this.$store.state.navCollapsed ? 'nav-collapsed' : ''
        },
    },

    methods: {

        callbackThreadCreated(threadID){
            console.log('DESDE BOARD thread_id es: ' + threadID)
            this.$router.push({ name: 'specificThread', params: { id: threadID }})


        },

        createThread(){
            lobby.newThread(this.callbackThreadCreated);

        }
    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "styles/app-no-styles.scss";

#content {
    background-color: $main-background-color;
    height: 100%;
    margin-left: $nav-width-expanded;
    
    &.nav-collapsed {
        margin-left: $nav-width-collapsed;
    }

}


</style>