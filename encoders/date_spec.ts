import { CborSerializer } from "../src";
import { DateNumberEncoder, DateStringEncoder } from "./date";

function _toHex(arr: ArrayBuffer) {
  return new Uint8Array(arr).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}

test('date (str)', () => {
  const s = CborSerializer.withDefaultEncoders();
  s.addEncoder(new DateStringEncoder());

  expect(_toHex(s.serialize(new Date(2000, 1, 2, 3, 4, 5, 6))))
    .toBe('c07818323030302d30322d30325431313a30343a30352e3030365a');
});

test('date (int)', () => {
  const s = CborSerializer.withDefaultEncoders();
  s.addEncoder(new DateNumberEncoder());

  expect(_toHex(s.serialize(new Date(2000, 1, 2, 3, 4, 5, 6)))).toBe('c11a38980f25');
});

test('date (EPOCH)', () => {
  const s = CborSerializer.withDefaultEncoders();
  s.addEncoder(new DateNumberEncoder());

  expect(_toHex(s.serialize(new Date(0)))).toBe('c100');
});
