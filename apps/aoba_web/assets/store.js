import Vue from 'vue'

import Vuex from 'vuex'

import {
    SAVE_THREAD,
    SAVE_LAST_PUSH,
    CLOSE_POST,
    SAVE_USER_POST,
    DRAG_N_DROP,
    POST_DRAG_N_DROP,
    OPERATION_TO_RECEIVED_BODY_ENTRY,
    RECEIVED_CLOSE_BODY_ENTRY,
    SAVE_MEDIA,
    SAVE_REPLY_TO
} from './mutation-types'
import {NOT_SET, OPEN, CLOSED, DRAGENTER, DRAGLEAVE, DROP} from './state'
import {USER, RECEIVED} from './types'
import * as fileType from 'file-type'
Vue.use(Vuex)


function save(mutation, response){
    store.commit(mutation, response)
}

function saveWithStatus(mutation, status, info){

    // https://stackoverflow.com/a/171256
    // ECMAScript 2018 object spread ...
    store.commit(mutation, {status: status, ...info})
    
    
    
}

function saveClosePost(mutation, threadID, postID, entries){
    store.commit(mutation, {threadID, postID, entries})
}

function newPost(state, type, response) {
    if (!(response.postID in state.threads[response.threadID].posts)) {
        Vue.set(
            state.threads[response.threadID].posts,
            response.postID,
            {
                status: response.closePost ? CLOSED : OPEN,
                type: type,
                media: null,
                entries: {}
            }


        )
    }
}

function saveNewThread(state, type, threadID, postID) {
    Vue.set(
        state.threads,
        threadID/*.toString()*/,
        {
            status: OPEN,
            posts: {
                [postID]: {
                    status: OPEN,
                    type: type,
                    media: null,
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
}

function saveMedia(state, threadID, postID, buffer) {
    Vue.set(
        state.threads[threadID].posts[postID],
        'media',
        {
            mime: (fileType(buffer)).mime,
            buffer: buffer
        }

    )
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



        [RECEIVED_CLOSE_BODY_ENTRY] (state, response) {


            Vue.set(
                state.threads[response.threadID].posts[response.postID].entries[response.entryID],
                'status',
                CLOSED
                



            )


            // %{"thread_id" => thread_id, "post_id" => post_id, "entry_id" => entry_id, "close_post" => close_post} = params


        },

        [SAVE_REPLY_TO] (state, response) {

            Vue.set(
                state.threads[response.threadID].posts[response.postID].entries[response.entryID],
                'replyTo',
                response.replyTo
                



            )


        },


        [OPERATION_TO_RECEIVED_BODY_ENTRY] (state, response) {

            newPost(state, RECEIVED, response)

            let content = (state.threads[response.threadID].posts[response.postID].entries[response.entryID] &&
                          state.threads[response.threadID].posts[response.postID].entries[response.entryID].content)
                          || ''
            if (response.action === "append") {
                content += response.content
            } else if (response.action === "replace") {
                content = response.content
            }

            let replyTo
            if (response.replyTo) {
                replyTo = {postID: response.replyTo.postID, entryID: response.replyTo.entryID}
            }
            else {
                replyTo = state.threads[response.threadID].posts[response.postID].entries[response.entryID] &&
                          state.threads[response.threadID].posts[response.postID].entries[response.entryID].replyTo || null
            }

            Vue.set(
                state.threads[response.threadID].posts[response.postID].entries,
                response.entryID,
                {
                    replyTo: replyTo,
                    status: response.closeEntry ? CLOSED : OPEN,
                    content: content,

                }
                



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



        [SAVE_THREAD] (state, response) {
            saveNewThread(state, response.type, response.threadID, response.postID)
        },
        [SAVE_USER_POST](state, info) {

            newPost(state, USER, info)
            
            Vue.set(
                state.threads[info.threadID].posts,
                info.postID,
                {
                    status: OPEN,
                    type: USER,
                    media: null,
                    entries: {
                        1: {}
                    }
                }

            )



            state.currentPost = {status: 'OK', response: 'OK', id: info.post_id}
            
        },

        [SAVE_MEDIA] (state, response) {

            /* De momento sólo se permite un media por Post, así que si llega
             * un nuevo media, eso quiere decir que también es un Post nuevo.
             */
            if (response.type === RECEIVED) {
                newPost(state, RECEIVED, response)
            }
            
            saveMedia(state, response.threadID, response.postID, response.media)

        },


        [CLOSE_POST] (state, {threadID, postID, entries}) {

            if(entries && state.threads[threadID].posts[postID].type === 'USER') {
                for (var entryID in entries){
                    if (entries.hasOwnProperty(entryID)){
                        let replyTo = state.threads[threadID].posts[postID].entries[entryID] &&
                                      state.threads[threadID].posts[postID].entries[entryID].replyTo || null
                        Vue.set(
                            state.threads[threadID].posts[postID].entries,
                            entryID,
                            {
                                replyTo: replyTo,
                                content: entries[entryID]
                            }
                            
    
                        )
                    }
                }
            }
            
            

          
            Vue.set(
                state.threads[threadID].posts[postID],
                'status',
                CLOSED
            )
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

