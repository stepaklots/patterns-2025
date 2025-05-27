import { Row } from '@/week-1/1-oop/lib/row';
import { Table } from '@/week-1/1-oop/lib/table';

export class ConsoleWriter {
  readonly #table: Table;
  readonly #valueJoiner: string;

  constructor(params: {
    data: Table,
    valueJoiner: string,
  }) {
    this.#table = params.data;
    this.#valueJoiner = params.valueJoiner;
  }

  write(): void {
    const rows: Row[] = this.#table.data();
    for (const row of rows) {
      console.log(row.toString(this.#valueJoiner));
    }
  }
}
