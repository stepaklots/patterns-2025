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

function getPadConfig() {
  return [
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
  ]
}

function lineBreaker() {
  return '\n';
}

function separator() {
  return ',';
}

function splitLines(data) {
  return data
    .split(lineBreaker())
    .map(value => value.trim());
}

function parseLine(line) {
  return line
    .trim()
    .split(separator())
    .map(value => value.trim());
}

function parseData(lines, skipFirstRow) {
  return skipFirstRow
    ? lines.slice(1).map(line => parseLine(line))
    : lines.map(line => parseLine(line));
}

function parseCsv({ input, withHeader = true }) {
  return {
    header: withHeader ? parseLine(splitLines(input)[0]) : [],
    data: parseData(splitLines(input), withHeader),
  };
}

function appendNormalizedColumn(data, sourceIndex) {
  const maxValue = data
    .map(row => row[sourceIndex])
    .reduce((a, b) => Math.max(a, b), -Infinity);
  return data
    .map(row => row.concat(
      [Math.round(row[sourceIndex] / maxValue * 100).toString()]
    ));
}

function normalize({ input, normalizeBy, newColumnName }) {
  return {
    header: input.header.concat([newColumnName]),
    data: appendNormalizedColumn(
      input.data,
      input.header.indexOf(normalizeBy),
    ),
  }
}

function sort({ input, sortBy }) {
  const index = input.header.indexOf(sortBy);
  return {
    header: input.header,
    data: [...input.data].sort((a, b) => b[index] - a[index]),
  };
}

function pad({ input, config }) {
  return {
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
  };

}

function print({ input, separator }) {
  input.data
    .forEach(row => console.log(row.join(separator)));
}

function main() {
  print({
    input: pad({
      input: sort({
        input: normalize({
          input: parseCsv({
            input: data,
            withHeader: true,
          }),
          normalizeBy: 'density',
          newColumnName: 'normalized-density',
        }),
        sortBy: 'normalized-density',
      }),
      config: getPadConfig()
    }),
    separator: '',
  });
}

main();
