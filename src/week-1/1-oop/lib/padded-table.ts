import { Row } from '@/week-1/1-oop/lib/row';
import { Cell } from '@/week-1/1-oop/lib/cell';
import { Table } from '@/week-1/1-oop/lib/table';
import {
  PaddingAlign,
  PaddingConfig
} from '@/week-1/1-oop/padding.config';

export class PaddedTable implements Table {
  readonly #header: Row;
  readonly #data: Row[] = [];

  constructor(params: {
    data: Table,
    config: PaddingConfig[],
  }) {
    const { data, config } = params;
    this.#header = data.header();
    this.#data = this.#align(data, config);
  }

  #align(data: Table, config: PaddingConfig[]) {
    const header = data.header();
    const rows = data.data();
    const foundPadding = header.get()
      .map(
        (h: Cell) => config.find(c => c.name === h.stringValue())
      );
    const result: Row[] = [];
    for (const row of rows) {
      const values = row.get();
      const newRowValues = [];
      for (let i = 0; i < header.get().length; i++) {
        const pad = foundPadding[i];
        let paddedCell = values[i];
        if (pad && pad.align === PaddingAlign.left)
          paddedCell = new Cell(
            values[i]
              .stringValue()
              .padEnd(pad.length)
          );
        if (pad && pad.align === PaddingAlign.right)
          paddedCell = new Cell(
            values[i]
              .stringValue()
              .padStart(pad.length)
          );
        newRowValues.push(paddedCell);
      }
      result.push(new Row(newRowValues));
    }
    return result;
  }

  header() {
    return this.#header;
  }

  data() {
    return this.#data;
  }
}
