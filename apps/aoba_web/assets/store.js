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
    SAVE_REPLY_TO,
    SAVE_CATALOG
} from './mutation-types'
import {NOT_SET, DRAGENTER, DRAGLEAVE, DROP} from './state'
import {USER, RECEIVED} from './types'
import * as fileType from 'file-type'
Vue.use(Vuex)


function save(mutation, response){
    store.commit(mutation, response)
}

function saveWithStatus(mutation, status, info){

    if (Array.isArray(info))
    {
        store.commit(mutation, {status: status, info})
    }
    else{
        // https://stackoverflow.com/a/171256
        // ECMAScript 2018 object spread ...
        store.commit(mutation, {status: status, ...info})
    }
    
    
    
    
    
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
                closed: response.closePost,
                type: type,
                media: {
                    buffer: null,
                    mime: null
                },
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
            closed: false,
            posts: {
                [postID]: {
                    closed: false,
                    type: type,
                    media: {
                        buffer: null,
                        media: null
                    },
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
        //currentThread: {status: NOT_SET, response: null, id: null},
        //currentPost: {status: NOT_SET, response: null, id: null},
        app_dragging: NOT_SET,
        post_dragging: NOT_SET,
        threads: {},
        threadIDs: [],
        threadIDsUser: [],
        replyPostID: null
    },


    mutations: {


        [SAVE_CATALOG] (state, catalog) {
            
            for (let thread of catalog.info){
              console.log(thread.thread_id)
              
              for (const[postID, post] of Object.entries(thread.posts)){
                thread.posts[postID] = post
                thread.posts[postID].type = "RECEIVED"
                if (thread.posts[postID].media){
                    thread.posts[postID].media.mime = (fileType(thread.posts[postID].media.buffer)).mime

                }
                
              }
              Vue.set(
                state.threads,
                thread.thread_id,
                thread
                )
            }
            
        
        },



        [RECEIVED_CLOSE_BODY_ENTRY] (state, response) {


            Vue.set(
                state.threads[response.threadID].posts[response.postID].entries[response.entryID],
                'closed',
                true
                



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
                    closed: response.closeEntry,
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
                    closed: false,
                    type: USER,
                    media: {
                        mime: null,
                        buffer: null
                    },
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
                'closed',
                true
            )
            //state.currentPost = {closed: true, response: 'OK', id: state.currentPost.id}
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

