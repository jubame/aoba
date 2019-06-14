import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)


export const store = new Vuex.Store({
    state: {
        thread: null
    },
    mutations: {
        save_thread(state, status, response) {
            state.thread = {status: status, response: response}
        }

    }
});
  