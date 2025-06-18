'use strict';

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

const paddingConfig = {
  city: {
    name: 'city',
    length: 18,
    align: 'left',
  },
  population: {
    name: 'population',
    length: 10,
    align: 'right',
  },
  area: {
    name: 'area',
    length: 8,
    align: 'right',
  },
  density: {
    name: 'density',
    length: 8,
    align: 'right',
  },
  country: {
    name: 'country',
    length: 18,
    align: 'right',
  },
  normalizedDensity: {
    name: 'normalized-density',
    length: 6,
    align: 'right',
  },
}

const parseCsv = ({ input, withHeader, delimiter, lineBreaker }) => {
  const lines = input.split(lineBreaker);
  let headers = null;
  if (withHeader) {
    headers = lines.shift().split(delimiter);
  }
  const data = lines
    .map(line => line.split(delimiter).map((value) => value.trim()));
  return { columnNames: headers, data };
}

const normalize = ({ input, columnNames, normalizeBy, newColumnName }) => {
  const sourceIndex = columnNames.indexOf(normalizeBy);
  if (!sourceIndex) return;
  columnNames.push(newColumnName);
  const rows = input;
  let maxValue = 1;
  for (const row of rows) {
    const value = parseInt(row[sourceIndex]);
    if (value > maxValue) {
      maxValue = value;
    }
  }
  for (const row of rows) {
    const relativePercentage = (row[sourceIndex] / maxValue) * 100;
    const rounded = Math.round(relativePercentage);
    row.push(rounded.toString());
  }
}

const sort = ({ input, columnNames, sortBy, sortOrder }) => {
  const sortIndex = columnNames.indexOf(sortBy);
  if (!sortIndex) return;
  const rows = input;
  rows.sort((r1, r2) => {
    if (sortOrder === 'DESC') {
      return r2[sortIndex] - r1[sortIndex];
    } else {
      return r1[sortIndex] - r2[sortIndex];
    }
  });
}

const addPadding = ({ input, columnNames, config }) => {
  const rows = input;
  for (const row of rows) {
    for (let i = 0; i < columnNames.length; i++) {
      const pad = config.find(c => c.name === columnNames[i]);
      if (pad && pad.align === 'left')
        row[i] = row[i].padEnd(pad.length);
      if (pad && pad.align === 'right')
        row[i] = row[i].padStart(pad.length);
    }
  }
}

const consolePrint = ({ input, delimiter }) => {
  const rows = input;
  for (const row of rows) {
    console.log(row.join(delimiter));
  }
}

function main() {
  const { columnNames, data: csvData } = parseCsv({
    input: data,
    withHeader: true,
    delimiter: ',',
    lineBreaker: '\n',
  });

  normalize({
    input: csvData,
    columnNames,
    normalizeBy: paddingConfig.density.name,
    newColumnName: paddingConfig.normalizedDensity.name,
  });

  sort({
    input: csvData,
    columnNames,
    sortBy: paddingConfig.normalizedDensity.name,
    sortOrder: 'DESC',
  });

  addPadding({
    input: csvData,
    columnNames,
    config: Object.values(paddingConfig),
  });

  consolePrint({
    input: csvData,
    delimiter: '',
  });
}

main();

export {
  parseCsv,
  normalize,
  sort,
  addPadding,
  consolePrint,
  paddingConfig
}
