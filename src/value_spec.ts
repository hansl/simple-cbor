import * as cbor from "./value";
import { CborValue } from "./value";

function _toHex(arr: CborValue) {
  return new Uint8Array(arr).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}

test("u Small", () => {
  const testCases: [number, string][] = [
    [0, "00"],
    [9, "09"],
    [22, "16"],
    [23, "17"],
    [24, "17"],
    [90, "17"], // Clamped.
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.uSmall(value));
    expect(hex).toBe(expected);
  }
});

test("u8", () => {
  const testCases: [number, string][] = [
    [0, "1800"],
    [90, "185a"],
    [900, "18ff"], // Clamped.
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.u8(value));
    expect(hex).toBe(expected);
  }
});

test("u16", () => {
  const testCases: [number, string][] = [
    [0, "190000"],
    [90, "19005a"],
    [9000, "192328"],
    [90000, "19ffff"],
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.u16(value));
    expect(hex).toBe(expected);
  }
});

test("u32", () => {
  const testCases: [number, string][] = [
    [0, "1a00000000"],
    [90, "1a0000005a"],
    [9000, "1a00002328"],
    [90000, "1a00015f90"],
    [900000, "1a000dbba0"],
    [9000000, "1a00895440"],
    [90000000, "1a055d4a80"],
    [900000000, "1a35a4e900"],
    [9000000000, "1affffffff"],
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.u32(value));
    expect(hex).toBe(expected);
  }
});

test("u64", () => {
  const testCases: [number, string][] = [
    [0, "1b0000000000000000"],
    [90, "1b000000000000005a"],
    [9000, "1b0000000000002328"],
    [90000, "1b0000000000015f90"],
    [900000, "1b00000000000dbba0"],
    [9000000, "1b0000000000895440"],
    [90000000, "1b00000000055d4a80"],
    [900000000, "1b0000000035a4e900"],
    [9000000000, "1b0000000218711a00"],
    [90000000000, "1b00000014f46b0400"],
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.u64(value));
    expect(hex).toBe(expected);
  }
});

test("u64 (str)", () => {
  const testCases: [string, number | undefined, string][] = [
    ["0", 10, "1b0000000000000000"],
    ["90", 10, "1b000000000000005a"],
    ["9000", 10, "1b0000000000002328"],
    ["90000", 10, "1b0000000000015f90"],
    ["900000", 10, "1b00000000000dbba0"],
    ["9000000", 10, "1b0000000000895440"],
    ["90000000", 10, "1b00000000055d4a80"],
    ["900000000", 10, "1b0000000035a4e900"],
    ["9000000000", 10, "1b0000000218711a00"],
    ["90000000000", 10, "1b00000014f46b0400"],
    ["0123456789ABCDEF", 16, "1b0123456789abcdef"],
  ];

  for (const [value, radix, expected] of testCases) {
    const hex = _toHex(cbor.u64(value, radix));
    expect(hex).toBe(expected);
  }
});

test("i Small", () => {
  const testCases: [number, string][] = [
    [-0, "00"],
    [-9, "28"],
    [-23, "36"],
    [-24, "37"],
    [-25, "37"],
    [-90, "37"],
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.iSmall(value));
    expect(hex).toBe(expected);
  }
});

test("i8", () => {
  const testCases: [number, string][] = [
    [-1, "3800"],
    [-90, "3859"],
    [-254, "38fd"],
    [-255, "38fe"],
    [-256, "38ff"],
    [-257, "38ff"],
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.i8(value));
    expect(hex).toBe(expected);
  }
});

test("i16", () => {
  const testCases: [number, string][] = [
    [-1, "390000"],
    [-90, "390059"],
    [-9000, "392327"],
    [-65535, "39fffe"],
    [-65536, "39ffff"],
    [-90000, "39ffff"],
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.i16(value));
    expect(hex).toBe(expected);
  }
});

test("i32", () => {
  const testCases: [number, string][] = [
    [-1, "3a00000000"],
    [-90, "3a00000059"],
    [-9000, "3a00002327"],
    [-90000, "3a00015f8f"],
    [-900000, "3a000dbb9f"],
    [-9000000, "3a0089543f"],
    [-90000000, "3a055d4a7f"],
    [-900000000, "3a35a4e8ff"],
    [-0xfffffffe, "3afffffffd"],
    [-0xffffffff, "3afffffffe"],
    [-0x100000000, "3affffffff"],
    [-0x100000001, "3affffffff"],
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.i32(value));
    expect(hex).toBe(expected);
  }
});

test("i64", () => {
  const testCases: [number, string][] = [
    [0, "3b0000000000000000"],
    [-1, "3b0000000000000000"],
    [-90, "3b0000000000000059"],
    [-9000, "3b0000000000002327"],
    [-90000, "3b0000000000015f8f"],
    [-900000, "3b00000000000dbb9f"],
    [-9000000, "3b000000000089543f"],
    [-90000000, "3b00000000055d4a7f"],
    [-900000000, "3b0000000035a4e8ff"],
    [-9000000000, "3b00000002187119ff"],
    [-90000000000, "3b00000014f46b03ff"],
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.i64(value));
    expect(hex).toBe(expected);
  }
});

test("i64 (str)", () => {
  const testCases: [string, number | undefined, string][] = [
    ["0", 10, "3b0000000000000000"],
    ["-1", 10, "3b0000000000000000"],
    ["-90", undefined, "3b0000000000000059"],
    ["-9000", undefined, "3b0000000000002327"],
    ["-90000", undefined, "3b0000000000015f8f"],
    ["-900000", 10, "3b00000000000dbb9f"],
    ["-9000000", 10, "3b000000000089543f"],
    ["-90000000", 10, "3b00000000055d4a7f"],
    ["-900000000", 10, "3b0000000035a4e8ff"],
    ["-9000000000", 10, "3b00000002187119ff"],
    ["-90000000000", 10, "3b00000014f46b03ff"],
    ["-0123456789ABCDEF", 16, "3b0123456789abcdee"],
    ["-0123456000000000", 16, "3b0123455fffffffff"],
    ["-0000000000000000", 16, "1b0000000000000000"],
  ];

  for (const [value, radix, expected] of testCases) {
    const hex = _toHex(cbor.i64(value, radix));
    expect(hex).toBe(expected);
  }
});

test("generic numbers", () => {
  const testCases: [number, string][] = [
    [0, "00"],
    [1, "01"],
    [24, "1818"],
    [32, "1820"],
    [255, "18ff"],
    [256, "190100"],
    [257, "190101"],
    [90000, "1a00015f90"],
    [900000, "1a000dbba0"],
    [9000000, "1a00895440"],
    [90000000, "1a055d4a80"],
    [900000000, "1a35a4e900"],
    [9000000000, "1b0000000218711a00"],
    [90000000000, "1b00000014f46b0400"],
    [-1, "20"],
    [-90, "3859"],
    [-9000, "392327"],
    [-90000, "3a00015f8f"],
    [-90000000, "3a055d4a7f"],
    [-900000000, "3a35a4e8ff"],
    [-9000000000, "3b00000002187119ff"],
    [-90000000000, "3b00000014f46b03ff"],
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.number(value));
    expect(hex).toBe(expected);
  }
});

test("getBytes", () => {
  const testCases: [number[], string][] = [
    [[1, 2, 3], "43010203"],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      "540102030405060708090a0b0c0d0e0f1011121314",
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      "570102030405060708090a0b0c0d0e0f1011121314151617",
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      "58180102030405060708090a0b0c0d0e0f101112131415161718",
    ],
    [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
      "58190102030405060708090a0b0c0d0e0f10111213141516171819",
    ],
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.bytes(new Uint8Array(value)));
    expect(hex).toBe(expected);
  }
});

test("string", () => {
  const testCases: [string, string][] = [
    ["A", "6141"],
    ["ABCDEFGHIJ", "6a4142434445464748494a"],
    ["ABCDEFGHIJKLMNOPQRSTUVW", "774142434445464748494a4b4c4d4e4f5051525354555657"],
    ["ABCDEFGHIJKLMNOPQRSTUVWX", "78184142434445464748494a4b4c4d4e4f505152535455565758"],
    ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "781a4142434445464748494a4b4c4d4e4f505152535455565758595a"],
  ];

  for (const [value, expected] of testCases) {
    const hex = _toHex(cbor.string(value));
    expect(hex).toBe(expected);
  }
});

test("array (1)", () => {
  const hex = _toHex(cbor.array([cbor.string("A")]));
  expect(hex).toBe("816141");
});

test("array (2)", () => {
  const hex = _toHex(cbor.array([cbor.array([cbor.string("A")])]));
  expect(hex).toBe("81816141");
});

test("map (1)", () => {
  const hex = _toHex(cbor.map(new Map([["A", cbor.u8(16)]])));
  expect(hex).toBe("a161411810");
});

test("map (2)", () => {
  const hex = _toHex(cbor.map(new Map([["A", cbor.map({ B: cbor.u8(16) })]])));
  expect(hex).toBe("a16141a161421810");
});

test("map (stable = false)", () => {
  const hex = _toHex(cbor.map({ B: cbor.u8(16), A: cbor.u8(15) }));
  expect(hex).toBe("a2614218106141180f");
});

test("map (stable = true)", () => {
  const hex = _toHex(cbor.map({ B: cbor.u8(16), A: cbor.u8(15) }, true));
  expect(hex).toBe("a26141180f61421810");
});

test("simple values", () => {
  const hex = _toHex(
    cbor.map({
      F: cbor.false_(),
      T: cbor.true_(),
      N: cbor.null_(),
      U: cbor.undefined_(),
    })
  );

  expect(hex).toBe("a46146f46154f5614ef66155f7");
});
