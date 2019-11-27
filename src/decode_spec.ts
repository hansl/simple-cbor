import * as cbor from "./decode";
import { Stream } from "./stream";

function _bufferFromHex(hex: string, size: number = ((hex.length + 1) / 2 | 0)): Uint8Array {
  return new Uint8Array(
    hex.padStart(size * 2, '0').match(/../g)!.map(byte => parseInt(byte, 16)),
  );
}

test("u Small", () => {
  const testCases: [number, string][] = [
    [0, "00"],
    [9, "09"],
    [22, "16"],
    [23, "17"],
  ];

  for (const [expected, hex] of testCases) {
    const stream = new Stream(_bufferFromHex(hex));
    const value = cbor.decodeUSmall(stream);
    expect(value).toBe(expected);
  }
});

test("u8", () => {
  const testCases: [number, string][] = [
    [0, "1800"],
    [90, "185a"],
    [255, "18ff"],
  ];

  for (const [expected, hex] of testCases) {
    const stream = new Stream(_bufferFromHex(hex));
    const value = cbor.decodeU8(stream);
    expect(value).toBe(expected);
  }
});

test("u16", () => {
  const testCases: [number, string][] = [
    [0, "190000"],
    [90, "19005a"],
    [9000, "192328"],
    [65535, "19ffff"],
  ];

  for (const [expected, hex] of testCases) {
    const stream = new Stream(_bufferFromHex(hex));
    const value = cbor.decodeU16(stream);
    expect(value).toBe(expected);
  }
});
