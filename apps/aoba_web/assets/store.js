import Vue from 'vue'

import Vuex from 'vuex'

import {SAVE_PENDING_THREAD, SAVE_LAST_PUSH, CLOSE_POST, SAVE_POST, DRAG_N_DROP, POST_DRAG_N_DROP, SAVE_RECEIVED_THREAD, NEW_PENDING_THREAD} from './mutation-types'
import {NOT_SET, CLOSED, DRAGENTER, DRAGLEAVE, DROP} from './state'


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
        app_dragging: NOT_SET,
        post_dragging: NOT_SET,
        receivedThreads: [],
        newThreads: []
    },
    mutations: {
        [SAVE_RECEIVED_THREAD] (state, {content, ids}) {
            let entry_id = ids.entry_id || 1
            // https://stackoverflow.com/a/31788802
            /*
            state.receivedThreads[ids.thread_id.toString()] =
                {
                    [ids.post_id]: {
                        [entry_id]:
                        content
                    },
                }
            
            */

            // https://vuex.vuejs.org/guide/mutations.html#mutations-follow-vue-s-reactivity-rules
            
            state.receivedThreads.push(
                {
                    thread_id: ids.thread_id.toString(),
                    posts: {
                        [ids.post_id]: {
                            entries: {
                                [entry_id]:
                                content
                            }
                        },
                    }
                }
            )
                
            
           
            

        },
        [NEW_PENDING_THREAD] (state) {
            
            state.newThreads.push(
                {
                    thread_id: 'pending',
                    // para v-bind:key, puesto que no tenemos ID del hilo todavía
                    threadPendingID: Date.now(), 
                    posts: {
                    }
                }
            )
                
            
        },
        [SAVE_PENDING_THREAD] (state, {response, info}) {
            state.currentThread = {status: 'OK', response: response, id: info.thread_id}
            state.currentPost = {status: 'OK', response: response, id: info.post_id}

            let pendingThread = state.newThreads.find(function(element) {
                return element.thread_id === 'pending'
            })

            pendingThread.thread_id = info.thread_id



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
        [DRAG_N_DROP] (state, eventName) {
            state.app_dragging = eventName
        },
        [POST_DRAG_N_DROP] (state, eventName) {
            state.post_dragging = eventName
        },


    }
});


export {store, save, saveClosePost};

