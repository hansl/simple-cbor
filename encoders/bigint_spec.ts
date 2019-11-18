import { CborSerializer } from "../src";
import { BigIntEncoder } from "./bigint";

function _toHex(arr: Uint8Array) {
  return arr.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}

test('bigint (1)', () => {
  const s = CborSerializer.withDefaultEncoders();
  s.addEncoder(new BigIntEncoder());

  expect(_toHex(s.serialize(0x010000000000000000n))).toBe('c249010000000000000000');
});
