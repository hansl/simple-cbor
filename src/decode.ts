import { MajorType, MinorType } from "./constants";
import { Stream } from "./stream";

export const Unknown = Symbol('cbor-unknown');

/**
 * A decoder function. Takes an array buffer, and returns either an array with only
 * a new or same buffer (if it does not recognize the type), or an array with a new
 * or same buffer and the value understood.
 * The returned buffer should be sliced according to how many bytes were used from
 * the decoding. For example, the value `00` (1 byte, unsigned int 0) should return
 * a slice of the buffer removing the first byte, since it was consumed.
 */
export interface DecoderFunction<T> {
  (stream: Stream): T | typeof Unknown;
}

// function _toHex(arr: Uint8Array) {
//   return arr.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
// }

export const decodeUSmall: DecoderFunction<number> = function(stream: Stream) {
  const type = stream.peek();

  if ((type & MajorType.Mask) == MajorType.UnsignedInteger
      && (type & MajorType.MinorMask) < MinorType.Int8) {
    return stream.pop() & MajorType.MinorMask;
  }
  return Unknown;
};

export const decodeU8: DecoderFunction<number> = function(stream: Stream) {
  const type = stream.peek();

  if ((type & MajorType.Mask) == MajorType.UnsignedInteger
    && (type & MajorType.MinorMask) == MinorType.Int8) {
    stream.pop();  // Remove type.
    return stream.pop();  // Return Uint8.
  }
  return Unknown;
};

export const decodeU16: DecoderFunction<number> = function(stream: Stream) {
  const type = stream.peek();

  if ((type & MajorType.Mask) == MajorType.UnsignedInteger
    && (type & MajorType.MinorMask) == MinorType.Int16) {
    stream.pop();  // Remove type.
    return stream.pop() << 8 + stream.pop();
  }
  return Unknown;
};

//
// export const decodeU32: DecoderFunction<number> = function(buffer: ArrayBuffer) {
//   const array = new Uint8Array(buffer);
//   const type = array[0];
//
//   if ((type & MajorType.Mask) == MajorType.UnsignedInteger
//     && (type & MajorType.MinorMask) == MinorType.Int32) {
//     return [buffer.slice(5), array[1] << 24 + array[2] << 16 + array[3] << 8 + array[4]];
//   }
//   return [buffer];
// };
//
// export const decodeU64: DecoderFunction<string> = function(buffer: ArrayBuffer) {
//   const array = new Uint8Array(buffer);
//   const type = array[0];
//
//   if ((type & MajorType.Mask) == MajorType.UnsignedInteger
//     && (type & MajorType.MinorMask) == MinorType.Int64) {
//     return [buffer.slice(9), _toHex(array.slice(1, 9))];
//   }
//   return [buffer];
// };
//
// export const decodeISmall: DecoderFunction<number> = function(buffer: ArrayBuffer) {
//   const array = new Uint8Array(buffer);
//   const type = array[0];
//
//   if ((type & MajorType.Mask) == MajorType.SignedInteger
//     && (type & MajorType.MinorMask) < MinorType.Int8) {
//     return [buffer.slice(1), -(type & MajorType.MinorMask) - 1];
//   }
//   return [buffer];
// };
//
// export const decodeI8: DecoderFunction<number> = function(buffer: ArrayBuffer) {
//   const array = new Uint8Array(buffer);
//   const type = array[0];
//
//   if ((type & MajorType.Mask) == MajorType.SignedInteger
//     && (type & MajorType.MinorMask) == MinorType.Int8) {
//     return [buffer.slice(2), -(array[1] + 1)];
//   }
//   return [buffer];
// };
//
// export const decodeI16: DecoderFunction<number> = function(buffer: ArrayBuffer) {
//   const array = new Uint8Array(buffer);
//   const type = array[0];
//
//   if ((type & MajorType.Mask) == MajorType.SignedInteger
//     && (type & MajorType.MinorMask) == MinorType.Int16) {
//     return [buffer.slice(3), -(array[1] << 8 + array[2] + 1)];
//   }
//   return [buffer];
// };
//
// export const decodeI32: DecoderFunction<number> = function(buffer: ArrayBuffer) {
//   const array = new Uint8Array(buffer);
//   const type = array[0];
//
//   if ((type & MajorType.Mask) == MajorType.SignedInteger
//     && (type & MajorType.MinorMask) == MinorType.Int32) {
//     return [buffer.slice(5), -(array[1] << 24 + array[2] << 16 + array[3] << 8 + array[4] + 1)];
//   }
//   return [buffer];
// };
//
// export const decodeI64: DecoderFunction<string> = function(buffer: ArrayBuffer) {
//   const array = new Uint8Array(buffer);
//   const type = array[0];
//
//   if ((type & MajorType.Mask) == MajorType.SignedInteger
//     && (type & MajorType.MinorMask) == MinorType.Int64) {
//
//     // We need to do -1 to the number.
//     let done = false;
//     let hex = _toHex(array.slice(1, 9)).split("").reduceRight((acc, x) => {
//       if (done) {
//         return x + acc;
//       }
//
//       let n = parseInt(x, 16) + 1;
//       if (n < 16) {
//         done = true;
//         return n.toString(16) + acc;
//       } else {
//         return "0" + acc;
//       }
//     }, "");
//
//     return [buffer.slice(9), hex];
//   }
//   return [buffer];
// };
