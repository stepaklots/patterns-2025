const data = `city,population,area,density,country
  Shanghai,24256800,6340,3826,China
  Delhi,16787941,1484,11313,India
  Lagos,16060303,1171,13712,Nigeria
  Istanbul,14160467,5461,2593,Turkey
  Tokyo,13513734,2191,6168,Japan
  Sao Paulo,12038175,1521,7914,Brazil
  Mexico City,8874724,1486,5974,Mexico
  London,8673713,1572,5431,United Kingdom
  New York City,8537673,784,10892,United States
  Bangkok,8280925,1569,5279,Thailand`;

const padConfig = () => [
  {
    name: 'city',
    length: 18,
    align: 'left',
  },
  {
    name: 'population',
    length: 10,
    align: 'right',
  },
  {
    name: 'area',
    length: 8,
    align: 'right',
  },
  {
    name: 'density',
    length: 8,
    align: 'right',
  },
  {
    name: 'country',
    length: 18,
    align: 'right',
  },
  {
    name: 'normalized-density',
    length: 6,
    align: 'right',
  },
];

const lineBreaker = () => '\n';
const separator = () => ',';

const splitLines = (data) => data
  .split(lineBreaker());

const parseLine = (line) => line
  .split(separator())
  .map(value => value.trim());

const parseData = (lines, skipFirstRow) => lines
  .slice(skipFirstRow ? 1 : 0)
  .map(line => parseLine(line));

const parseCsv = (input, withHeader = true) => ({
  header: withHeader ? parseLine(splitLines(input)[0]) : [],
  data: parseData(splitLines(input), withHeader),
});

const getColumnMaxValue = (data, columnIndex) => data
  .map(row => parseInt(row[columnIndex], 10))
  .reduce((max, value) => Math.max(max, value), -Infinity);

const appendNormalizedColumn = (data, sourceIndex) => {
  const maxValue = getColumnMaxValue(data, sourceIndex);
  return data
    .map(row => [...row, Math.round(row[sourceIndex] / maxValue * 100).toString()]);
}

const normalize = (normalizeBy, newColumnName, input) => ({
  header: [...input.header, newColumnName],
  data: appendNormalizedColumn(
    input.data,
    input.header.indexOf(normalizeBy),
  ),
});

const sort = (sortBy, input) => {
  const index = input.header.indexOf(sortBy);
  return {
    header: input.header,
    data: input.data.toSorted((a, b) => b[index] - a[index]),
  };
}

const pad = (config, input) => ({
  header: input.header,
  data: input.data.map(row => {
    return row.map((value, index) => {
      const padConfig = config.find((c) => c.name === input.header[index]);
      if (padConfig) {
        return padConfig.align === 'left'
          ? value.padEnd(padConfig.length)
          : value.padStart(padConfig.length);
      }
      return value;
    });
  }),
});

const print = (printerFn, separator, input) => input.data
  .forEach(row => printerFn(row.join(separator)));

const main = () =>
  print(
    console.log,
    '',
    pad(
      padConfig(),
      sort(
        'normalized-density',
        normalize(
          'density',
          'normalized-density',
          parseCsv(data, true),
        ),
      ),
    ),
  );

main();

export {
  parseCsv,
  normalize,
  sort,
  pad,
  print,
}
