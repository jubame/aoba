<template>
  <section>
    <button id="accordion-open-1" class="accordion__button" v-bind:class="{expanded: isOpen}"
            v-on:click="toggleState()">
        {{newThreadTitle}}
    </button>
    <div id="accordion-section-1" class="accordion__section">
        <post newThread = "true"></post>
    </div>

  </section>



</template>

<script>
import Vue from 'vue'
import Post from './Post'


const state = {
    OPEN: 'open',
    CLOSED: 'closed'
};

export default {

    components: {
        'post': Post,
    },



    
    
    
    data () {
        



        return {
            state: state.CLOSED
        }
    },

    computed: {
        isOpen: function(){
            return this.state === state.OPEN
        },
        newThreadTitle() {
            return this.$store.state.currentThread && this.$store.state.currentThread.id
                   || "New thread"
        }
        
    },

    methods: {
        toggleState: function(){
            this.state =  this.state === state.CLOSED ? state.OPEN : state.CLOSED
        }
    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    #content {
    background-color: #ffe;
    }

    // https://www.a11ywithlindsey.com/blog/javascript-accessibility-accordions/
    $purple: #6505cc;
    $dark-purple: #310363;
    $lavendar: #eedbff;

    body {
    font-family: 'Roboto', sans-serif;
    color: $purple;
    }

    .accordion {
    width: 40rem;
    
    h2 {
        margin: -1px 0 0;
        border: 1px solid $purple;
    }
    
    p {
        margin: 0;
    }
    
    &__button {
        position: relative;
        display: block;
        margin: -1px 0 0;
        border: 1px solid $purple;
        padding: 0.5rem 1rem;
        width: 100%;
        text-align: left;
        color: $purple;
        font-size: 1rem;
        background: $lavendar;
        
        &:focus, 
        &:hover {
        background: $dark-purple;
        color: $lavendar;
        
        &::after {
            border-top-color: $lavendar;
        }
        }
        
        &::after {
        content: '';
        position: absolute;
        right: 1rem;
        top: 0.65rem;
        width: 0; 
        height: 0; 
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 15px solid $purple;
        }
    }
    
    &__button.expanded {
        background: $purple;
        color: $lavendar;
        
        &::after {
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 15px solid $lavendar;
            border-top: none;
        }
    }
    
    &__section {
        border-left: 1px solid $purple;
        border-right: 1px solid $purple;
        background: $lavendar;
        max-height: 0vh;
        overflow: hidden;
        padding: 0;
    }
    
    &__button.expanded + &__section {
        max-height: 100vh;
        overflow: auto;
        padding: 0;
        visibility: visible;
        textarea {
            display: inline;
            margin: 0 0 0 -3px 0;
            overflow-y: hidden;
            resize: none;
            vertical-align: baseline;
        }
    }
    }


</style>