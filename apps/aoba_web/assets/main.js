// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {store} from './store'
import dragPlugin from './js/drag'
import without from 'lodash';
Vue.config.productionTip = false
export const EventBus = new Vue();





// https://forum.vuejs.org/t/how-to-use-helper-functions-for-imported-modules-in-vuejs-vue-template/6266/7
Vue.use(dragPlugin)


/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  store,
  router,
  components: {
      App
    },
  template: '<App/>'
});
  






// Register a global custom directive called `v-focus`
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})
