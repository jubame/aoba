import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)



function saveThreadResponse(status, ids) {
    store.commit('save_thread', {status, ids})
}


const store = new Vuex.Store({
    state: {
        currentThread: null,
        currentPost: null
    },
    mutations: {
        save_thread(state, {status, ids}) {
            state.currentThread = {status: status, id: ids.thread_id}
            state.currentPost = {id: ids.post_id}
        }

    }
});


export {store, saveThreadResponse};

