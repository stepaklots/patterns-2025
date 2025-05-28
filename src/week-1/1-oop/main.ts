import { SortedTable } from '@/week-1/1-oop/lib/sorted-table';
import { PaddedTable } from '@/week-1/1-oop/lib/padded-table';
import { NormalizedTable } from '@/week-1/1-oop/lib/normalized-table';
import { ConsoleWriter } from '@/week-1/1-oop/lib/console-writer';
import { config as paddingConfig } from '@/week-1/1-oop/padding.config';
import { CsvTable } from '@/week-1/1-oop/lib/csv-table';
import { input } from '@/week-1/1-oop/input';

const csvTable = new CsvTable({
  input,
  withHeader: true,
  delimiter: ',',
  lineBreaker: '\n',
});

const normalizedTable = new NormalizedTable({
  data: csvTable,
  normalizeBy: 'density',
  newColumnName: '% max area',
});

const sortedTable = new SortedTable({
  data: normalizedTable,
  sortBy: '% max area',
});

const paddedTable = new PaddedTable({
  data: sortedTable,
  config: paddingConfig,
});

const writer = new ConsoleWriter({
  data: paddedTable,
  delimiter: '',
});
writer.write();
