import { CborValue } from "./value";
import * as decode from "./decode";

const primitiveDecoders = Object.values(decode);

export interface CborDecoder<T> {
  readonly name: string;
  readonly priority: number;

  decode(buffer: ArrayBuffer): [ArrayBuffer, T?];
}

export class JsonDefaultCborDecoder implements CborDecoder<any> {
  readonly name = "json";
  readonly priority = -100;

  decode(buffer: ArrayBuffer): [ArrayBuffer, any?] {
    for (const decode of primitiveDecoders) {
      const result = decode(buffer);
      if (result.length == 2) {
        return result;
      }
      buffer = result[0];
    }

    return [buffer];
  }
}

export class CborDeserializer {
  private _decoders = new Set<CborDecoder<any>>();

  static withDefaultDecoders() {
    const s = new this();

    return s;
  }

  removeDecoder(name: string) {
    // Has to make an extra call to values() to ensure it doesn't break on iteration.
    for (const decoder of this._decoders.values()) {
      if (decoder.name == name) {
        this._decoders.delete(decoder);
      }
    }
  }
  addDecoder<T = any>(decoder: CborDecoder<T>) {
    this._decoders.add(decoder);
  }

  getDecoderFor<T = any>(value: any): CborDecoder<T> {
    let chosenDecoder: CborDecoder<any> | null = null;

    for (const decoder of this._decoders) {
      if (!chosenDecoder || decoder.priority > chosenDecoder.priority) {
        if (decoder.match(value)) {
          chosenDecoder = decoder;
        }
      }
    }

    if (chosenDecoder === null) {
      throw new Error("Could not find an decoder for value.");
    }

    return chosenDecoder;
  }

  serializeValue(value: any): CborValue {
    return this.getDecoderFor(value).decode(value);
  }

  serialize(value: any): ArrayBuffer {
    return this.serializeValue(value);
  }
}
