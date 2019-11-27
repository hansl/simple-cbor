export const enum MajorType {
  Mask = 0b1110_0000,
  MinorMask = 0b0001_1111,

  UnsignedInteger = 0 << 5,
  SignedInteger = 1 << 5,
  ByteString = 2 << 5,
  TextString = 3 << 5,
  Array = 4 << 5,
  Map = 5 << 5,
  Tag = 6 << 5,
  SimpleValue = 7 << 5,
}

export const enum MinorType {
  Int8 = 24,
  Int16 = 25,
  Int32 = 26,
  Int64 = 27,
}

export const MAX_U64_NUMBER = 0x20000000000000;
