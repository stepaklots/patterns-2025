import { Table } from '@/week-1/1-oop/lib/table';
import { Cell } from '@/week-1/1-oop/lib/cell';
import { Row } from '@/week-1/1-oop/lib/row';

export class CsvTable implements Table {
  readonly #header: Row;
  readonly #data: Row[] = [];

  constructor(params: {
    input: string,
    withHeader: boolean,
    delimiter: string,
    lineBreaker: string,
  }) {
    const {
      input,
      withHeader,
      delimiter,
      lineBreaker,
    } = params;
    this.#header = new Row([]);
    if (!input) return;
    const lines = input.split(lineBreaker);
    if (!lines.length || lines.length < 1) return;
    if (withHeader) {
      this.#header = new Row(
        lines[0]
          .split(delimiter)
          .map((c: string) => new Cell(c))
      );
      lines.shift();
    } else {
      this.#header = new Row([]);
    }
    this.#data = lines
      .slice(1)
      .map((line: string) => {
        const cells = line
          .split(delimiter)
          .map((c: string) => new Cell(c));
        return new Row(cells);
      });
  }

  header(): Row {
    return this.#header;
  }

  data(): Row[] {
    return this.#data;
  }
}
