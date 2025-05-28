import { Row } from '@/week-1/1-oop/lib/row';
import { Table } from '@/week-1/1-oop/lib/table';

export class ConsoleWriter {
  readonly #table: Table;
  readonly #delimiter: string;

  constructor(params: {
    data: Table,
    delimiter: string,
  }) {
    this.#table = params.data;
    this.#delimiter = params.delimiter;
  }

  write(): void {
    const rows: Row[] = this.#table.data();
    for (const row of rows) {
      console.log(row.toString(this.#delimiter));
    }
  }
}
