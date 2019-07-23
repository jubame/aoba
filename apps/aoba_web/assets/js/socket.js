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
  SAVE_USER_THREAD,
  SAVE_LAST_PUSH,
  CLOSE_POST,
  SAVE_USER_POST,
  OPERATION_TO_RECEIVED_BODY_ENTRY,
  RECEIVED_CLOSE_BODY_ENTRY,
  SAVE_USER_MEDIA,
  SAVE_RECEIVED_MEDIA,
  
} from '../mutation-types'
import {encodeMessage, decodeMessage} from './message_pack'
import {EventBus} from '../main.js'

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


// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("threadserver:lobby", {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })


channel.on("new_thread", response => {
    console.log("New thread:", response.thread_id)
    EventBus.$emit('new_thread', response.thread_id, response.post_id)
})

channel.on("operation_to_body_entry", response => {
  console.log("operation_to_body_entry", response)
  save(OPERATION_TO_RECEIVED_BODY_ENTRY,
    {
      action: response.action,
      threadID: response.thread_id,
      postID: response.post_id,
      entryID: response.entry_id,
      content: response.iolist,
      closeEntry: response.close_entry,
      closePost: response.close_post}
    )
  //EventBus.$emit('new_thread', response.thread_id, response.post_id)
})


channel.on("close_body_entry", response => {
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


channel.on("close_post", response => {
  console.log("close_post:", response.thread_id)
  saveClosePost(CLOSE_POST, response.thread_id, response.post_id);
})


channel.on("add_media_to_post", response => {
  console.log("add_media_to_post:", response.thread_id)
  save(SAVE_RECEIVED_MEDIA, {
    threadID: response.thread_id,
    postID: response.post_id,
    media: response.media
  })
})


function newThread(callbackThreadCreated){
  
  channel.push("new_thread")
  .receive("ok", response => {
    saveWithStatus(SAVE_USER_THREAD, "ok", {threadID: response.thread_id, postID: response.post_id})
    callbackThreadCreated(response)
  })
  .receive("error", response => {
    saveWithStatus(SAVE_USER_THREAD, "error", response.reason)
  })
}


function newPost(threadID, callbackPostCreated, originPostID, originEntryID){
  
  channel.push("new_post", {thread_id: threadID})
  .receive("ok", response => {
    saveWithStatus(SAVE_USER_POST, "ok", {threadID: threadID, postID: response.post_id})
    callbackPostCreated({threadID: threadID, postID: response.post_id}, originPostID, originEntryID)
  })
  .receive("error", response => {
    saveWithStatus(SAVE_USER_POST, "error", response.reason)
  })
}


function operationToBodyEntry(action, thread_id, post_id, entry_id, content, closeEntry, closePost){
  channel.push("operation_to_body_entry", {action: action, thread_id: thread_id, post_id: post_id, entry_id: entry_id, iolist: content, close_entry: closeEntry, close_post: closePost})
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
  channel.push("close_body_entry", {thread_id: thread_id, post_id: post_id, entry_id: entry_id, close_post: closePost})
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

function closeUserPost(threadID, postID) {

  channel.push("close_post", {thread_id: threadID, post_id: postID})
  .receive("ok", response => {
    saveClosePost(CLOSE_POST, threadID, postID);
  })
  
}



function addMediaToPost(threadID, postID, media) {

  save(SAVE_USER_MEDIA, {
    threadID: threadID,
    postID: postID,
    media: media
  })

  channel.push("add_media_to_post", {thread_id: threadID, post_id: postID, media: media})
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
