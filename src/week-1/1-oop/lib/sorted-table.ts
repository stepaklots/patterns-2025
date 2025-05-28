import { Row } from '@/week-1/1-oop/lib/row';
import { Table } from '@/week-1/1-oop/lib/table';

export class SortedTable implements Table {
  readonly #header: Row;
  readonly #data: Row[] = [];

  constructor(params: {
    data: Table,
    sortBy: string,
  }) {
    const { data, sortBy } = params;
    this.#header = data.header();
    const rows = data.data();
    const sortIndex = data.header().indexOf(sortBy);
    if (!sortIndex) {
      this.#data = rows;
      return;
    }
    this.#data = rows.sort(
      (r1, r2) => r2.at(sortIndex).numberValue() - r1.at(sortIndex).numberValue()
    );
  }

  header() {
    return this.#header;
  }

  data() {
    return this.#data;
  }
}
