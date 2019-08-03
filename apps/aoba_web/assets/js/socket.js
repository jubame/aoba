// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import {Socket} from "phoenix"
import {save, saveClosePost, saveWithStatus} from '../store'
import {
  SAVE_THREAD,
  SAVE_LAST_PUSH,
  CLOSE_POST,
  SAVE_USER_POST,
  OPERATION_TO_RECEIVED_BODY_ENTRY,
  RECEIVED_CLOSE_BODY_ENTRY,
  SAVE_MEDIA,
  
} from '../mutation-types'
import {encodeMessage, decodeMessage} from './message_pack'
import {EventBus} from '../main.js'
import {USER, RECEIVED} from '../types'

let socket = new Socket(
  "/socket",
  {params:
    {token: window.userToken},
    encode: encodeMessage,
    decode: decodeMessage
  }
)

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect()
socket.conn.binaryType = 'arraybuffer'


/*
 * https://stackoverflow.com/questions/40414566/phoenix-channels-multiple-channels-per-socket
 * Utilizo dos subtopics (realmente topics, los dos puntos son sólo una
 * convención):
 *   threadserver:lobby          eventos generales (new_thread...)
 *   threadserver:<thread_id>    eventos de un hilo en particular (nuevo post,
 *                               nuevo entry, nuevo media...)
 * De esta manera, reduzco el tráfico a lo realmente necesario para el usuario
 * en cada momento, evitando escuchar todos los eventos de todos los hilos en
 * un sólo topic.
 * Cuando el usuario abandone el hilo, tendré que hacer un leave.
 * El explorador utiliza un sólo websocket para los dos, a pesar de que aquí
 * haga socket.channel(...) dos veces:
 *   channelLobby = socket.channel("threadserver:lobby", {})
 *   channelThread = socket.channel("threadserver:" + threadID, {})
 *  En Phoenix se enruta todo a AobaWeb.ThreadServerChannel, porque tengo
 *  puesto esto en AobaWeb.UserSocket:
 *    channel "threadserver:*", AobaWeb.ThreadServerChannel
 *  Parece que al final en el servidor se arrancan dos procesos de ThreadServerChannel:
 *    https://stackoverflow.com/a/40426617
 *    It seems to me the Channel module is similar to a GenServer and the join
 *    is somewhat like start_link, where a new server (process) is spun up
 *    (however, only if it does not already exist).
*/
// Now that you are connected, you can join channels with a topic:
let channelLobby = socket.channel("threadserver:lobby", {})
channelLobby.join()
  .receive("ok", resp => { console.log("lobby Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })
let channelThread


channelLobby.on("new_thread", response => {
  
    initializeThreadChannel(response.thread_id)

    channelThread.join()
    .receive("ok", resp => {
      console.log(response.thread_id + " Joined successfully", resp)
      saveWithStatus(SAVE_THREAD, "ok", {type: RECEIVED, threadID: response.thread_id, postID: response.post_id})
    }
    )
    .receive("error", resp => { console.log("Unable to join", resp) })

    
})

function newThread(callbackThreadCreated){
  
  channelLobby.push("new_thread")
  .receive("ok", response => {
    initializeThreadChannel(response.thread_id)

    channelThread.join()
    .receive("ok", resp => {
      console.log(response.thread_id + " Joined successfully", resp)
      saveWithStatus(SAVE_THREAD, "ok", {type: USER, threadID: response.thread_id, postID: response.post_id})
    }
    )
    .receive("error", resp => { console.log("Unable to join", resp) })


    
  })
  .receive("error", response => {
    saveWithStatus(SAVE_USER_THREAD, "error", response.reason)
  })
}




function initializeThreadChannel(threadID){
  channelThread = socket.channel("threadserver:" + threadID, {})
  initializeThreadCallbacks()

}

function initializeThreadCallbacks(){
  channelThread.on("operation_to_body_entry", response => {
    console.log("operation_to_body_entry", response)
    
    let replyTo
    if (response.reply_to){
      replyTo = {postID: response.reply_to.post_id, entryID: response.reply_to.entry_id}
    }
    else {
      replyTo = null
    }
  
    save(OPERATION_TO_RECEIVED_BODY_ENTRY,
      {
        action: response.action,
        threadID: response.thread_id,
        postID: response.post_id,
        entryID: response.entry_id,
        content: response.iolist,
        closeEntry: response.close_entry,
        closePost: response.close_post,
        replyTo: replyTo
      }
      )
    //EventBus.$emit('new_thread', response.thread_id, response.post_id)
  })
  
  
  channelThread.on("close_body_entry", response => {
    console.log("close_body_entry", response)
    save(RECEIVED_CLOSE_BODY_ENTRY,
      {
        
        threadID: response.thread_id,
        postID: response.post_id,
        entryID: response.entry_id,
        closeEntry: response.close_entry,
        closePost: response.close_post}
      )
  
  
      // %{"thread_id" => thread_id, "post_id" => post_id, "entry_id" => entry_id, "close_post" => close_post} = params
      
    //EventBus.$emit('new_thread', response.thread_id, response.post_id)
  })
  
  
  channelThread.on("close_post", response => {
    console.log("close_post:", response.thread_id)
    saveClosePost(CLOSE_POST, response.thread_id, response.post_id);
  })
  
  
  channelThread.on("add_media_to_post", response => {
    console.log("add_media_to_post:", response.thread_id)
    save(SAVE_MEDIA, {
      type: RECEIVED,
      threadID: response.thread_id,
      postID: response.post_id,
      media: response.media
    })
  })

}






function newPost(threadID, callbackPostCreated, originPostID, originEntryID){
  
  channelThread.push("new_post", {thread_id: threadID})
  .receive("ok", response => {
    saveWithStatus(SAVE_USER_POST, "ok", {threadID: threadID, postID: response.post_id})
    callbackPostCreated({threadID: threadID, postID: response.post_id}, originPostID, originEntryID)
  })
  .receive("error", response => {
    saveWithStatus(SAVE_USER_POST, "error", response.reason)
  })
}


function operationToBodyEntry(action, thread_id, post_id, entry_id, content, closeEntry, closePost, replyTo){
  let pushParams
  if (replyTo){
    pushParams = {action: action, thread_id: thread_id, post_id: post_id, entry_id: entry_id, iolist: content, close_entry: closeEntry, close_post: closePost,
      reply_to: {post_id: replyTo.postID, entry_id: replyTo.entryID}}
  }
  else {
    pushParams = {action: action, thread_id: thread_id, post_id: post_id, entry_id: entry_id, iolist: content, close_entry: closeEntry, close_post: closePost}
  }
  channelThread.push("operation_to_body_entry", pushParams)
  .receive("ok", response => {
    saveWithStatus(SAVE_LAST_PUSH, "ok", response)
  })
  .receive("error", response => {
    let info = {
      reason: response.reason,
      entry_id: entry_id
    }
    saveWithStatus(SAVE_LAST_PUSH, "error", info)
  })
}



function closeBodyEntry(thread_id, post_id, entry_id, closePost){
  channelThread.push("close_body_entry", {thread_id: thread_id, post_id: post_id, entry_id: entry_id, close_post: closePost})
  .receive("ok", response => {
    saveWithStatus(SAVE_LAST_PUSH, "ok", response)
  })
  .receive("error", response => {
    let info = {
      reason: response.reason,
      entry_id: entry_id
    }
    saveWithStatus(SAVE_LAST_PUSH, "error", info)
  })
}

function closeUserPost(threadID, postID, entries) {

  channelThread.push("close_post", {thread_id: threadID, post_id: postID})
  .receive("ok", response => {
    saveClosePost(CLOSE_POST, threadID, postID, entries);
  })
  
}



function addMediaToPost(threadID, postID, media) {

  save(SAVE_MEDIA, {
    type: USER,
    threadID: threadID,
    postID: postID,
    media: media
  })

  channelThread.push("add_media_to_post", {thread_id: threadID, post_id: postID, media: media})
  .receive("ok", response => {
    console.log(response)
  })
  .receive("error", response => {
    console.log(response)
  })
}



//window.newThread = newThread
window.appendToBodyEntry = operationToBodyEntry

export default socket
export {newThread, operationToBodyEntry, closeBodyEntry, addMediaToPost, closeUserPost, newPost}
