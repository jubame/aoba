// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"

// https://codesandbox.io/s/o29j95wx9
import Vue from 'vue'


/* eslint-disable no-new */
new Vue({
  el: '#vue-app',
  data() {
    return {
        message: 'hello, world!'
    }
}
})
