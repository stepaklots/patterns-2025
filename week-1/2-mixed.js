'use strict'

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

const PadAlign = {
  'left': 'left',
  'right': 'right',
}

const DataPadConfig = {
  city: {
    name: 'city',
    length: 18,
    align: PadAlign.left,
  },
  population: {
    name: 'population',
    length: 10,
    align: PadAlign.right,
  },
  area: {
    name: 'area',
    length: 8,
    align: PadAlign.right,
  },
  density: {
    name: 'density',
    length: 8,
    align: PadAlign.right,
  },
  country: {
    name: 'country',
    length: 18,
    align: PadAlign.right,
  },
  areaNormalized: {
    name: '% max area',
    length: 6,
    align: PadAlign.right,
  },
}

class CsvData {
  #input;
  #withHeader;

  constructor({ input, withHeader }) {
    this.#input = input;
    this.#withHeader = withHeader;
  }

  parse() {
    let header = [];
    let rows = [];
    const lines = this.#input.split('\n');
    if (this.#withHeader) {
      header = lines[0].split(',');
      lines.shift();
    }
    for (const line of lines) {
      const cells = line.split(',');
      rows.push(cells);
    }
    return { header, rows };
  }
}

class Table {
  #header;
  #rows = [];

  constructor({ header, rows }) {
    this.#header = header;
    this.#rows = rows;
  }

  normalize({ source, destination }) {
    const sourceIndex = this.#header.indexOf(source);
    const maxValue = this.#rows
      .map(row => row[sourceIndex])
      .reduce((a, b) => Math.max(a, b), -Infinity);

    for (const row of this.#rows) {
      const relativePercentage = (row[sourceIndex] / maxValue) * 100;
      const rounded = Math.round(relativePercentage);
      row.push(rounded.toString());
    }
    this.#header.push(destination);
    return this;
  }

  sort({ columnName }) {
    const sortIndex = this.#header.indexOf(columnName);
    if (!sortIndex) return this;
    this.#rows = this.#rows.sort((r1, r2) => r2[sortIndex] - r1[sortIndex]);
    return this;
  }

  pad({ config }) {
    const foundPadding = this.#header
      .map(h => config.find(c => c.name === h));
    for (const row of this.#rows) {
      for (let i = 0; i < this.#header.length; i++) {
        const pad = foundPadding[i];
        if (pad && pad.align === PadAlign.left)
          row[i] = row[i].padEnd(pad.length);
        if (pad && pad.align === PadAlign.right)
          row[i] = row[i].padStart(pad.length);
      }
    }
    return this;
  }

  print() {
    for (const row of this.#rows) {
      console.log(row.join(''));
    }
  }
}

const csvData = new CsvData({
  input: data,
  withHeader: true,
});
const table = new Table(csvData.parse());

table
  .normalize({
    source: DataPadConfig.density.name,
    destination: DataPadConfig.areaNormalized.name,
  })
  .sort({
    columnName: DataPadConfig.areaNormalized.name
  })
  .pad({
    config: Object.values(DataPadConfig),
  })
  .print();


module.exports = {
  CsvData,
  Table,
  DataPadConfig,
  PadAlign,
}
