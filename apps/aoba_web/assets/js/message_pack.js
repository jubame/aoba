// https://stackoverflow.com/a/51759426
import * as  msgpack from 'msgpack-lite';

var codec = msgpack.createCodec({int64: true});
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