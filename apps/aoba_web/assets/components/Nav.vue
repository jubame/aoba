<template>
    <nav :class="collapsedClass">

    <ul>
        <li v-for="destination in destinations" :key="destination.name"
        v-on:click="change(destination)">
            
            {{destination.name | capitalize}}
        </li>
        <button @click="toggleCollapse">{{collapsedText}}</button>
    </ul>

    <p>Has elegido {{selected.name}}</p>



    </nav>
</template>

<script>
    import router from '../router'

    import {Destinations, OrderedDestinations} from '../config.js'
    import {
        TOGGLE_NAV_COLLAPSE,
    } from '../mutation-types'



    export default {

        data() {
        
            return {
                destinations: OrderedDestinations,
                selected: Destinations.HOME,
            }

        },

        computed: {
          collapsedClass() {
              return this.$store.state.navCollapsed ? 'collapsed' : ''
          },
          collapsedText(){
              return !this.$store.state.navCollapsed ? 'Hide' : 'Expand'
          }
        },

        methods: {
            change(destination) {
                this.selected = destination
                router.push({path: destination.path})
            },
            toggleCollapse(){
                this.$store.commit(TOGGLE_NAV_COLLAPSE)
            }
        },

        filters: {
            capitalize: function (value) {
                if (!value) return ''
                value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            },
            uppercase: function(value){
                return value.toUpperCase();
            }
        }

    }



</script>

<style lang="scss">
    @import "styles/app-no-styles.scss";


    nav {
        position: fixed;
        height: 100%;
        color: white;
        background-color: #1A1A1A;
        width: $nav-width-expanded;

        &.collapsed {
            width: $nav-width-collapsed;
        }
        



        ul {
            
            list-style-type: none;
            margin: 0;
            padding: 0;


            li {
                // https://stackoverflow.com/a/14850381
                $height: 50px;
                height: $height;
                line-height: $height;
                
                padding-left: 10px;
                cursor: pointer;
                
                // Para que no se mueva el texto al poner borde en li:hover
                // https://stackoverflow.com/a/9612782
                border-left: 4px solid transparent;


                
                

                &.seleccionado {
                    border-left: 4px solid teal;
                }
            }


            li:hover{
                border-left: 4px solid teal;
                color: yellow;
                background-color: rgb(70, 57, 70);

                .material-design-icon__svg{
                    fill: yellow;
                }

            }

        }

        





    }






</style>