import Vue from 'vue'

import Vuex from 'vuex'

import {SAVE_NEW_THREAD, SAVE_LAST_PUSH, CLOSE_POST, SAVE_POST, DRAG_N_DROP, POST_DRAG_N_DROP, SAVE_RECEIVED_THREAD} from './mutation-types'
import {NOT_SET, OPEN, CLOSED, DRAGENTER, DRAGLEAVE, DROP} from './state'
import {USER, RECEIVED} from './types'

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
        threads: {},
        threadIDs: [],
        threadIDsUser: [],
        replyPostID: null
    },
    mutations: {
        [SAVE_RECEIVED_THREAD] (state, {content, ids}) {
            //let entry_id = 
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
            

            Vue.set(
                state.threads,
                ids.thread_id.toString(),
                {
                    status: OPEN,
                    posts: {
                        [ids.post_id]: {
                            status: OPEN,
                            type: RECEIVED,
                            entries: {
                                status: OPEN,
                                [ids.entry_id || 1]:
                                content
                            }
                        },
                    }
                }

            )
            
            state.threadIDs.push(ids.thread_id.toString())
            
                
            
                
            
           
            

        },
        [SAVE_NEW_THREAD] (state, response) {

            Vue.set(
                state.threads,
                response.info.thread_id.toString(),
                {
                    status: OPEN,
                    posts: {
                        
                        [response.info.post_id]: {
                            status: OPEN,
                            type: USER
                        }
                        
                    },
                    /*
                    replyPosts: {
                        [response.info.post_id]: {
                            status: OPEN
                        }
                    }*/
                }    
            )



            state.threadIDs.push(response.info.thread_id.toString())
            state.threadIDsUser.push(response.info.thread_id.toString())



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

