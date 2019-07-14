// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import {Socket} from "phoenix"
import {save, saveClosePost} from '../store'
import {SAVE_NEW_THREAD, SAVE_LAST_PUSH, CLOSE_POST, SAVE_POST} from '../mutation-types'
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


function newThread(callbackThreadCreated){
  
  channel.push("new_thread")
  .receive("ok", response => {
    save(SAVE_NEW_THREAD, "ok", response)
    callbackThreadCreated(response)
  })
  .receive("error", response => {
    save(SAVE_NEW_THREAD, "error", response.reason)
  })
}


function newPost(threadID){
  
  channel.push("new_post", {thread_id: threadID})
  .receive("ok", response => {
    save(SAVE_POST, "ok", {threadID: threadID, postID: response.post_id})
  })
  .receive("error", response => {
    save(SAVE_POST, "error", response.reason)
  })
}


function operationToBodyEntry(action, thread_id, post_id, entry_id, content, closeEntry, closePost){
  channel.push("operation_to_body_entry", {action: action, thread_id: thread_id, post_id: post_id, entry_id: entry_id, iolist: content, close_entry: closeEntry, close_post: closePost})
  .receive("ok", response => {
    save(SAVE_LAST_PUSH, "ok", response)
  })
  .receive("error", response => {
    let info = {
      reason: response.reason,
      entry_id: entry_id
    }
    save(SAVE_LAST_PUSH, "error", info)
  })
}

function closeBodyEntry(thread_id, post_id, entry_id, closePost){
  channel.push("close_body_entry", {thread_id: thread_id, post_id: post_id, entry_id: entry_id, close_post: closePost})
  .receive("ok", response => {
    save(SAVE_LAST_PUSH, "ok", response)
  })
  .receive("error", response => {
    let info = {
      reason: response.reason,
      entry_id: entry_id
    }
    save(SAVE_LAST_PUSH, "error", info)
  })
}

function closeCurrentPost() {
  saveClosePost(CLOSE_POST);
}



function addMediaToPost(thread_id, post_id, media) {
  channel.push("add_media_to_post", {thread_id: thread_id, post_id: post_id, media: media})
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
export {newThread, operationToBodyEntry, closeBodyEntry, addMediaToPost, closeCurrentPost, newPost}
