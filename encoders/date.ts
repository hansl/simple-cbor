import { CborEncoder, CborValue, value } from "../src/index";

export class DateStringEncoder implements CborEncoder<Date> {
  readonly name = 'date';
  readonly priority = -10;

  match(value: any) {
    return value instanceof Date;
  }

  encode(v: Date): CborValue {
    return value.tagged(0, value.string(v.toISOString()));
  }
}

export class DateNumberEncoder implements CborEncoder<Date> {
  readonly name = 'date';
  readonly priority = -10;

  match(value: any) {
    return value instanceof Date;
  }

  encode(v: Date): CborValue {
    return value.tagged(1, value.number((v.getTime() - new Date(0).getTime()) / 1000.0));
  }
}
