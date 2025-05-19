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

class CSVData {
  #header = [];
  #rows = [];

  constructor({ input, withHeader }) {
    this.#parse(input, withHeader);
  }

  #parse(input, withHeader) {
    if (!input) return;
    const lines = input.split('\n');
    if (withHeader) {
      this.#header = lines[0].split(',');
    }
    for (let i = 1; i < lines.length; i++) {
      this.#rows.push(lines[i].split(','));
    }
  }

  getHeader() {
    return Array.from(this.#header);
  }

  getRows() {
    return Array.from(this.#rows);
  }
}

class NormalizedData {
  #header = [];
  #rows = [];

  constructor({ data, normalizeBy, newColumnName }) {
    this.#header = data.getHeader();
    this.#header.push(newColumnName);
    const normalizeByIndex = data.getHeader().indexOf(normalizeBy);
    this.#addRelativePercentage(data.getRows(), normalizeByIndex)
  }

  #addRelativePercentage(rows, sourceIndex) {
    const maxValue = rows
      .map(row => row[sourceIndex])
      .reduce((a, b) => Math.max(a, b), -Infinity);

    for (const row of rows) {
      const relativePercentage = (row[sourceIndex] / maxValue) * 100;
      const rounded = Math.round(relativePercentage);
      row.push(rounded.toString());
      this.#rows.push(row);
    }
  }

  getHeader() {
    return Array.from(this.#header);
  }

  getRows() {
    return Array.from(this.#rows);
  }
}

class SortedData {
  #header = [];
  #rows = [];

  constructor({ data, sortBy }) {
    this.#header = data.getHeader();
    const rows = data.getRows();
    const sortIndex = data.getHeader().indexOf(sortBy);
    if (!sortIndex) {
      this.#rows = rows;
      return;
    }
    this.#rows = rows.sort((r1, r2) => r2[sortIndex] - r1[sortIndex]);
  }

  getHeader() {
    return Array.from(this.#header);
  }

  getRows() {
    return Array.from(this.#rows);
  }
}

class PaddedData {
  #header = [];
  #rows = [];

  constructor({ data, config }) {
    this.#header = data.getHeader();
    this.#align(data, config);
  }

  #align(data, config) {
    const header = data.getHeader();
    const foundPadding = data.getHeader()
      .map(h => config.find(c => c.name === h));
    const rows = data.getRows();
    for (const row of rows) {
      for (let i = 0; i < header.length; i++) {
        const pad = foundPadding[i];
        if (pad && pad.align === PadAlign.left)
          row[i] = row[i].padEnd(pad.length);
        if (pad && pad.align === PadAlign.right)
          row[i] = row[i].padStart(pad.length);
      }
      this.#rows.push(row);
    }
  }

  getHeader() {
    return Array.from(this.#header);
  }

  getRows() {
    return Array.from(this.#rows);
  }
}

class ConsoleWriter {
  #data;

  constructor(data) {
    this.#data = data;
  }

  write() {
    const rows = this.#data.getRows();
    for (const row of rows) {
      console.log(row.join(''));
    }
  }
}

const writer = new ConsoleWriter(
  new PaddedData({
    data: new SortedData({
      data: new NormalizedData({
        data: new CSVData({
          input: data,
          withHeader: true,
        }),
        normalizeBy: DataPadConfig.density.name,
        newColumnName: DataPadConfig.areaNormalized.name,
      }),
      sortBy: DataPadConfig.areaNormalized.name,
    }),
    config: [
      DataPadConfig.city,
      DataPadConfig.population,
      DataPadConfig.area,
      DataPadConfig.density,
      DataPadConfig.country,
      DataPadConfig.areaNormalized,
    ],
  }),
);
writer.write();

