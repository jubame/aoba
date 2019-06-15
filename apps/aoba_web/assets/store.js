import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)


export {saveThreadResponse};

function saveThreadResponse(status, response) {
    store.commit('save_thread', {status, response})
}


const store = new Vuex.Store({
    state: {
        thread: null
    },
    mutations: {
        save_thread(state, {status, response}) {
            state.thread = {status: status, response: response}
        }

    }
});

