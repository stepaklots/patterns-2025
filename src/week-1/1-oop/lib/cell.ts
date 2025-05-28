import { Cloneable } from '@/week-1/1-oop/lib/cloneable';

export class Cell implements Cloneable<Cell> {
  readonly #value: any;

  constructor(value: any) {
    this.#value = value || null;
  }

  stringValue(): string {
    return this.#value.toString() || '';
  }

  numberValue(): number {
    return Number(this.#value);
  }

  clone(): Cell {
    return new Cell(this.#value);
  }
}
