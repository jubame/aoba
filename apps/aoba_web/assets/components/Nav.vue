<template>
    <nav>test</nav>
</template>

<script>




</script>

<style lang="scss">



    nav {
        flex: 0 0 15%;
        color: white;
        width: 60px;
        background-color: #1A1A1A;
        height: 100%;
        position: relative;

        &.menu-expandido {





             //background-color: green;
             width: 300px; /* ¿Se podrá poner como variable para que se comparta con Vue.js? */
            .texto {
                display: initial;
            }

            .material-design-icon {
                margin: initial;
            }

            .toggle-menu{
                position: absolute;
                right: 0;
                width: auto;
                height: 100%;

            }

            h1 {
                display: block;
            }

            h1:first-of-type {
                padding-top: 50px;
                margin-top: 0;
            }

            h1:nth-of-type(n+2) {
                margin-top: 40px;
                padding-top: 10px;
                border-top: 1px solid grey;

            }




         }

        h1 {
            display: none;
            text-transform: uppercase;
            font-size: 12px;
        }

        .texto {
            display: none;
            margin-left: 10px;
        }

        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;

            li:hover{
                border-left: 4px solid teal;

                .material-design-icon__svg{
                    fill: yellow;
                }

            }

            }

        li {

            display: flex;
            flex-direction: row;
            align-items: center;
            height: 50px;

            &.seleccionado {
                border-left: 4px solid teal;
                .material-design-icon__svg{
                    fill: lightyellow;
                }

            }
        }

        button {
            display: block;
            width: 100%;
            border: none;
        }

        .toggle-menu {

            height: 47px;

            background-color: #3a4f3b;

            .material-design-icon__svg{
                fill: white;
            }


            &:active {
                background-color: #1a4f3b;
            }

        }




        .material-design-icon {
            margin: 0 auto;
        }




        .material-design-icon__svg{

            fill: #ccc;
            width: 2em;




        }





    }






</style>