'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { Readable } = require('node:stream');
const { Database, LineCursor } = require('./1-module');

const testData = [
  { city: 'Beijing', country: 'China' },
  { city: 'New York', country: 'USA' },
];


const readStreamMock = (data) => {
  return Readable.from(data.map(e => JSON.stringify(e ) + '\n'));
};

class StorageTest extends Database {
  constructor() {
    super();
    this.stream = readStreamMock(testData);
  }

  select(query) {
    return new LineCursor(this, query);
  }
}

describe('file storage module unit tests', () => {
  const getCursorCount = async (cursor) => {
    let count = 0;
    for await (const record of cursor) {
      count++;
    }
    return count;
  }

  it('should iterate over stream', async () => {
    const db = new StorageTest();
    const cursor = db.select();

    let count = await getCursorCount(cursor);
    assert.strictEqual(count, 2, 'Expected 2');
  });


  it('should select data by query', async () => {
    const db = new StorageTest();
    const cursor = db.select({ city: 'Beijing' });

    let count = await getCursorCount(cursor);
    assert.strictEqual(count, 1, 'Expected 1');
  });
})
