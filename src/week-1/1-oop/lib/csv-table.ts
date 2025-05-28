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
    const { header, data } = this.#parse(params);
    this.#header = header;
    this.#data = data;
  }

  #parse(params: {
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
    const lines = this.#splitInput(input, lineBreaker);
    const header = this.#parseHeader(withHeader, lines, delimiter);
    const data = this.#parseData(lines, delimiter);
    return { header, data };
  }

  #splitInput(input: string, lineBreaker: string) {
    if (!input) {
      throw new TypeError('Input is required');
    }
    const lines = input.split(lineBreaker);
    if (!lines.length || lines.length < 1) {
      throw new TypeError('Input is empty');
    }
    return lines;
  }

  #parseHeader(
    withHeader: boolean,
    lines: string[],
    delimiter: string,
  ): Row {
    if (withHeader) {
      const headerStr = lines.shift() || '';
      return new Row(
        headerStr
          .split(delimiter)
          .map((c: string) => new Cell(c))
      );
    } else {
      return new Row([]);
    }
  }

  #parseData(lines: string[], delimiter: string) {
    return lines
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
