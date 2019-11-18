import { CborEncoder, CborValue, value } from "../src/index";

function _bufferFromHex(hex: string, size: number = ((hex.length + 1) / 2 | 0)): Uint8Array {
  return new Uint8Array(
    hex.padStart(size * 2, '0').match(/../g)!.map(byte => parseInt(byte, 16)),
  );
}

export class BigIntEncoder implements CborEncoder<BigInt> {
  constructor() {
    // Double check this is available.
    if (typeof BigInt == 'undefined') {
      throw new Error('BigInt not available.')
    }
  }

  readonly name = 'bigint';
  readonly priority = -10;

  match(value: any) {
    return typeof value == 'bigint';
  }

  encode(v: bigint): CborValue {
    if (v >= 0) {
      return value.tagged(2, value.bytes(_bufferFromHex(v.toString(16))));
    } else {
      return value.tagged(3, value.bytes(_bufferFromHex(v.toString(16))));
    }
  }
}
