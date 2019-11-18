import { CborSerializer, SelfDescribeCborSerializer } from "./serializer";

function _toHex(arr: Uint8Array) {
  return arr.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}

test("json", () => {
  const s = CborSerializer.withDefaultEncoders();

  const v = s.serialize({
    A: true,
    B: false,
    C: 123,
    D: "hello"
  });

  expect(_toHex(v)).toBe("a46141f56142f46143187b61446568656c6c6f");
});

test("json (self-describe)", () => {
  const s = SelfDescribeCborSerializer.withDefaultEncoders();

  const v = s.serialize({
    A: true,
    B: false,
    C: 123,
    D: "hello"
  });

  expect(_toHex(v)).toBe("d9d9f7a46141f56142f46143187b61446568656c6c6f");
});

test("complex (special encoder)", () => {
  const s = SelfDescribeCborSerializer.withDefaultEncoders();

  const v = s.serialize({
    A: true,
    B: false,
    C: 123,
    D: "hello"
  });

  expect(_toHex(v)).toBe("d9d9f7a46141f56142f46143187b61446568656c6c6f");
});
