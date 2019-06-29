import Vue from 'vue'

import Vuex from 'vuex'

import {SAVE_THREAD, SAVE_LAST_PUSH, DRAG, DROP, CLOSE_POST, SAVE_POST} from './mutation-types'
import {NOT_SET, CLOSED} from './state'


Vue.use(Vuex)


function save(mutation, status, info){
    store.commit(mutation, {status, info})
}

function saveClosePost(mutation){
    store.commit(mutation)
}




const store = new Vuex.Store({
    state: {
        currentThread: {status: NOT_SET, response: null, id: null},
        currentPost: {status: NOT_SET, response: null, id: null},
        dragging: false
    },
    mutations: {
        [SAVE_THREAD] (state, {response, info}) {
            state.currentThread = {status: 'OK', response: response, id: info.thread_id}
            state.currentPost = {status: 'OK', response: response, id: info.post_id}
        },
        [SAVE_POST](state, {response, info}) {
            state.currentPost = {status: 'OK', response: 'OK', id: info.post_id}
        },
        [CLOSE_POST] (state) {
            state.currentPost = {status: CLOSED, response: 'OK', id: state.currentPost.id}
        },
        [SAVE_LAST_PUSH] (state, {response, info}) {
            state.lastPush = {status: 'OK', response: response, info: info}
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

