import Vue from 'vue'

import Vuex from 'vuex'

import {SAVE_NEW_THREAD, SAVE_LAST_PUSH, CLOSE_POST, SAVE_POST, DRAG_N_DROP, POST_DRAG_N_DROP, SAVE_RECEIVED_THREAD, OPERATION_TO_BODY_ENTRY} from './mutation-types'
import {NOT_SET, OPEN, CLOSED, DRAGENTER, DRAGLEAVE, DROP} from './state'
import {USER, RECEIVED} from './types'

Vue.use(Vuex)


function save(mutation, response){
    store.commit(mutation, response)
}

function saveWithStatus(mutation, status, info){

    
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


        [OPERATION_TO_BODY_ENTRY] (state, response) {

            Vue.set(
                state.threads[response.threadID].posts[response.postID],
                response.entryID,
                response.content



            )

            /*
            "action" => action,
      "thread_id" => thread_id,
      "post_id" => post_id,
      "entry_id" => entry_id,
      "iolist" => iolist,
      "close_entry" => close_entry,
      "close_post" => close_post
        */




        },



        [SAVE_RECEIVED_THREAD] (state, {threadID, postID}) {
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
                threadID/*.toString()*/,
                {
                    status: OPEN,
                    posts: {
                        [postID]: {
                            status: OPEN,
                            type: RECEIVED,
                            entries: {
                                /*
                                [ids.entry_id || 1]:
                                status: OPEN,
                                content: content
                                */
                            }
                        },
                    }
                }

            )
            
            state.threadIDs.push(threadID)
            
                
            
                
            
           
            

        },
        [SAVE_NEW_THREAD] (state, response) {

            Vue.set(
                state.threads,
                response.info.thread_id/*.toString()*/,
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



            state.threadIDs.push(response.info.thread_id/*.toString()*/)
            state.threadIDsUser.push(response.info.thread_id/*.toString()*/)



        },
        [SAVE_POST](state, {status, info}) {

            Vue.set(
                state.threads[info.threadID].posts,
                info.postID,
                {
                    status: OPEN,
                    type: USER
                }

            )



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


export {store, save, saveWithStatus, saveClosePost};

