import Vue from 'vue'

import Vuex from 'vuex'

import {SAVE_THREAD, SAVE_LAST_PUSH, DRAG, DROP, CLOSE_POST, SAVE_POST} from './mutation-types'

Vue.use(Vuex)


function save(mutation, status, info){
    store.commit(mutation, {status, info})
}

function saveClosePost(mutation){
    store.commit(mutation)
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
        [SAVE_POST](state, {status, info}) {
            state.currentPost = {id: info.post_id}
        },
        [CLOSE_POST] (state) {
            state.currentPost = null
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


export {store, save, saveClosePost};

