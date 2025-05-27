import { Row } from '@/week-1/1-oop/lib/row';
import { Cell } from '@/week-1/1-oop/lib/cell';
import { Table } from '@/week-1/1-oop/lib/table';

export class NormalizedTable implements Table {
  readonly #header: Row;
  readonly #data: Row[] = [];

  constructor(params: {
    data: Table,
    normalizeBy: string,
    newColumnName: string,
  }) {
    const { data, normalizeBy, newColumnName } = params;
    const headerValues = data.header().get();
    headerValues.push(new Cell(newColumnName));
    this.#header = new Row(headerValues);
    const normalizeByIndex = data.header().indexOf(normalizeBy);
    this.#data = this.#addRelativePercentage(data.data(), normalizeByIndex);
  }

  #addRelativePercentage(rows: Row[], sourceIndex: number) {
    const maxValue = this.getMaxValueInColumn(rows, sourceIndex);
    const result: Row[] = [];
    for (const row of rows) {
      const relativePercentage = row.at(sourceIndex).numberValue() / maxValue * 100;
      const roundedValue = Math.round(relativePercentage);
      const newCell = new Cell(roundedValue.toString());
      const newRow = row.append(newCell);
      result.push(newRow);
    }
    return result;
  }

  private getMaxValueInColumn(rows: Row[], sourceIndex: number) {
    return rows
      .map(row => row.at(sourceIndex))
      .map(cells => cells.numberValue())
      .reduce((a, b) => Math.max(a, b), -Infinity);
  }

  header() {
    return this.#header;
  }

  data() {
    return this.#data;
  }
}
