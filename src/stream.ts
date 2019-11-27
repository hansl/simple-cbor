
export class Stream {
  protected _uint8 = new Uint8Array(this._buffer);
  constructor(protected _buffer: ArrayBuffer) {}

  /**
   * Return the next UINT8.
   */
  peek(): number {
    return this._uint8[0];
  }

  /**
   * Remove the next UINT8 from the stream, returning it.
   */
  pop(): number {
    const result = this._uint8[0];
    if (result === undefined) {
      throw new Error('Empty stream.');
    }

    this._uint8 = this._uint8.slice(1);
    return result;
  }

  get byteLength() {
    return this._uint8.byteLength;
  }
  get length() {
    return this._uint8.byteLength;
  }

  get buffer() {
    return this._uint8.buffer;
  }
}
