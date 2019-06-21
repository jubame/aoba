import Vue from 'vue'

import Vuex from 'vuex'

import {SAVE_THREAD, SAVE_LAST_PUSH, DRAG, DROP} from './mutation-types'

Vue.use(Vuex)


function save(mutation, status, info){
    store.commit(mutation, {status, info})
}





const store = new Vuex.Store({
    state: {
        currentThread: null,
        currentPost: null,
        dragging: false
    },
    mutations: {
        [SAVE_THREAD] (state, {status, info}) {
            state.currentThread = {status: status, id: info.thread_id}
            state.currentPost = {id: info.post_id}
        },
        [SAVE_LAST_PUSH] (state, {status, info}) {
            state.lastPush = {status: status, info: info}
        },
        [DRAG] (state) {
            state.dragging = true
        },
        [DROP] (state) {
            state.dragging = false
        }


    }
});


export {store, save};

