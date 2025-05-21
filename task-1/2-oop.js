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

class Row {
  #cells = [];

  constructor(cells) {
    this.#cells = cells;
  }

  get() {
    return this.#cells;
  }

  at(index) {
    return this.#cells[index];
  }

  indexOf(name) {
    return this.#cells.indexOf(name);
  }

  append(value) {
    this.#cells.push(value);
  }

  update(index, value) {
    this.#cells[index] = value;
  }

  toString() {
    return this.#cells.join('');
  }
}

class CSVData {
  #header;
  #data = [];

  constructor({ input, withHeader }) {
    this.#parse(input, withHeader);
  }

  #parse(input, withHeaderRow) {
    if (!input) return;
    const lines = input.split('\n');
    if (withHeaderRow) {
      this.#header = new Row(lines[0].split(','));
      this.#data = lines.slice(1).map(l => new Row(l.split(',')));
    } else {
      this.#data = lines.map(l => new Row(l.split(',')));
    }
  }

  header() {
    return this.#header;
  }

  get() {
    return this.#data;
  }
}

class NormalizedData {
  #header;
  #rows = [];

  constructor({ data, normalizeBy, newColumnName }) {
    this.#header = data.header();
    this.#header.append(newColumnName);
    const normalizeByIndex = data.header().indexOf(normalizeBy);
    this.#rows = this.#addRelativePercentage(data.get(), normalizeByIndex);
  }

  #addRelativePercentage(rows, sourceIndex) {
    const maxValue = rows
      .map(row => row.at(sourceIndex))
      .reduce((a, b) => Math.max(a, b), -Infinity);

    const result = [];
    for (const row of rows) {
      const relativePercentage = (row.at(sourceIndex) / maxValue) * 100;
      const rounded = Math.round(relativePercentage);
      row.append(rounded.toString());
      result.push(row);
    }
    return result;
  }

  header() {
    return this.#header;
  }

  get() {
    return this.#rows;
  }
}

class SortedData {
  #header;
  #rows = [];

  constructor({ data, sortBy }) {
    this.#header = data.header();
    const rows = data.get();
    const sortIndex = data.header().indexOf(sortBy);
    if (!sortIndex) {
      this.#rows = rows;
      return;
    }
    this.#rows = rows.sort((r1, r2) => r2.at(sortIndex) - r1.at(sortIndex));
  }

  header() {
    return this.#header;
  }

  get() {
    return this.#rows;
  }
}

class PaddedData {
  #header;
  #rows = [];

  constructor({ data, config }) {
    this.#header = data.header();
    this.#rows = this.#align(data, config);
  }

  #align(data, config) {
    const header = data.header();
    const foundPadding = data.header().get()
      .map(h => config.find(c => c.name === h));
    const rows = data.get();
    const result = [];
    for (const row of rows) {
      for (let i = 0; i < header.get().length; i++) {
        const pad = foundPadding[i];
        if (pad && pad.align === PadAlign.left)
          row.update(i, row.at(i).padEnd(pad.length));
        if (pad && pad.align === PadAlign.right)
          row.update(i, row.at(i).padStart(pad.length));
      }
      result.push(row);
    }
    return result;
  }

  header() {
    return this.#header;
  }

  get() {
    return this.#rows;
  }
}

class ConsoleWriter {
  #data;

  constructor({ data }) {
    this.#data = data;
  }

  write() {
    const rows = this.#data.get();
    for (const row of rows) {
      console.log(row.toString());
    }
  }
}

const csvData = new CSVData({
  input: data,
  withHeader: true,
});

const normalizedData = new NormalizedData({
  data: csvData,
  normalizeBy: DataPadConfig.density.name,
  newColumnName: DataPadConfig.areaNormalized.name,
});

const sortedData = new SortedData({
  data: normalizedData,
  sortBy: DataPadConfig.areaNormalized.name,
});

const paddedData = new PaddedData({
  data: sortedData,
  config: [
    DataPadConfig.city,
    DataPadConfig.population,
    DataPadConfig.area,
    DataPadConfig.density,
    DataPadConfig.country,
    DataPadConfig.areaNormalized,
  ],
});

const writer = new ConsoleWriter({ data: paddedData });
writer.write();
