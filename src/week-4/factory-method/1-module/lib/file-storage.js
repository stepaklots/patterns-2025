'use strict';

const fs = require('node:fs');
const Database = require('./database.js');
const LineCursor = require('./line-cursor.js');

class FileStorage extends Database {
  constructor(fileName) {
    super();
    this.fileName = fileName;
    this.stream = fs.createReadStream(fileName);
  }

  select(query) {
    return new LineCursor(this, query);
  }
}

module.exports = FileStorage;
