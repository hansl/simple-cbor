import { CborSerializer, CborValue } from "../src";
import { BigIntEncoder } from "./bigint";

function _toHex(arr: CborValue) {
  return new Uint8Array(arr).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}

test('bigint (1)', () => {
  const s = CborSerializer.withDefaultEncoders();
  s.addEncoder(new BigIntEncoder());

  expect(_toHex(s.serializeValue(0x010000000000000000n))).toBe('c249010000000000000000');
});
