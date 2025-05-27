import { Cell } from '@/week-1/1-oop/lib/cell';
import { PaddingAlign } from '@/week-1/1-oop/padding.config';

export class Row {
  readonly #cells: Cell[];

  constructor(cells: Cell[]) {
    this.#cells = cells || [];
  }

  get(): Cell[] {
    return this.#cells.map(c => c.clone());
  }

  append(newValue: Cell) {
    const values = this.#cells.map(c => c.clone());
    values.push(newValue);
    return new Row(values);
  }

  update(index: number, value: Cell) {
    const values = this.#cells.map(c => c.clone());
    values[index] = value;
    return new Row(values);
  }

  at(index: number): Cell {
    return this.#cells[index];
  }

  indexOf(name: string): number {
    const element = this.#cells.find(c => c.stringValue() === name);
    if (!element) return -1;
    return this.#cells.indexOf(element);
  }

  toString(separator: string) {
    return this.#cells.map(c => c.stringValue()).join(separator);
  }
}
