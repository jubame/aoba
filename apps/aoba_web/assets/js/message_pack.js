// https://stackoverflow.com/a/51759426
import * as  msgpack from 'msgpack-lite';


/*
Tengo que poner {int64: true} o de lo contrario, en el servidor me pone un .0 al final del identificador
HOLA
creando nuevo hilo
{:ok, #PID<0.569.0>}
{:ok, #PID<0.569.0>}
%{
  post_id: 1
  thread_id: 15612221231
}

[debug] INCOMING "append_to_body_entry" on "threadserver:lobby" to AobaWeb.ThreadServerChannel
  Parameters: %{"entry_id" => 1, "iolist" => " oio", "post_id" => 1, "thread_id" => 15612221231.0}
append_to_body_entry
[error] GenServer #PID<0.564.0> terminating
** (stop) exited in: GenServer.call({:via, Registry, {Registry.ThreadServer, 15612221231.0}}, {:append_to_body_entry, 1, 1, " oio"}, 5000)
    ** (EXIT) no process: the process is not alive or there's no process currently associated with the given name, possibly because its application isn't started

*/
var codec = msgpack.createCodec({int64: true, binarraybuffer: true});
var options = {codec: codec};


let encodeMessage = function (rawdata, callback) {
    if (!rawdata) {
      return;
    }
  
    let msg = msgpack.encode(rawdata, options);
  
    return callback(msg);
  }
  
  let decodeMessage = function (rawdata, callback) {
    if (!rawdata) {
      return;
    }
  
    let binary = new Uint8Array(rawdata);
    let data;
    //check for gzip magic bytes
    if (binary.length > 2 && binary[0] === 0x1F && binary[1] === 0x8B) {
      // TODO: Esto no lo he probado todavía.
      let inflate = new Zlib.Gunzip(binary);
      data = inflate.decompress();
      console.log('compressed:', binary.length, 'bytes | inflated:', data.length, 'bytes');
    } else {
      console.log('plain msgpacked:', binary.length, 'bytes');
      data = binary;
    }
    let msg = msgpack.decode(data, options);
  
    return callback(msg);
  }

  export {encodeMessage, decodeMessage}