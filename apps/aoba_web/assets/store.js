import Vue from 'vue'

import Vuex from 'vuex'

import {SAVE_THREAD, SAVE_LAST_PUSH} from './mutation-types'

Vue.use(Vuex)


function save(mutation, status, response){
    store.commit(mutation, {status, response})
}




const store = new Vuex.Store({
    state: {
        currentThread: null,
        currentPost: null
    },
    mutations: {
        [SAVE_THREAD] (state, {status, response}) {
            state.currentThread = {status: status, id: response.thread_id}
            state.currentPost = {id: response.post_id}
        },
        [SAVE_LAST_PUSH] (state, {response}) {
            state.lastPush = {response: response}
        }


    }
});


export {store, save};

