'use strict';

const readline = require('node:readline');
const Cursor = require('./cursor.js');

class LineCursor extends Cursor {
  constructor(storage, query) {
    super();
    this.query = query;
    this.lines = readline
      .createInterface({
        input: storage.stream,
        crlfDelay: Infinity,
      })
      [Symbol.asyncIterator]();
  }

  [Symbol.asyncIterator]() {
    const cursor = this;
    return {
      async next() {
        do {
          const { value, done } = await cursor.lines.next();
          if (done) return { done: true };
          cursor.current++;
          const data = JSON.parse(value);
          let condition = true;
          const { query } = cursor;
          for (const field in query) {
            condition = condition && data[field] === query[field];
          }
          if (condition) return { value: data, done: false };
        } while (true);
      },
    };
  }
}

module.exports = LineCursor;
