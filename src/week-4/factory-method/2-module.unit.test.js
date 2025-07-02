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
  return Readable.from(data.map(e => JSON.stringify(e) + '\n'));
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
  const iterate = async (cursor) => {
    const result = [];
    for await (const record of cursor) {
      result.push(record);
    }
    return result;
  }

  it('should iterate over stream', async () => {
    const db = new StorageTest();
    const cursor = db.select();

    let result = await iterate(cursor);

    assert.strictEqual(result.length, 2, 'Expected 2');
    assert.deepStrictEqual(result, testData, 'Expected equal data');
  });


  it('should select data by query', async () => {
    const db = new StorageTest();
    const cursor = db.select({ city: 'Beijing' });

    let result = await iterate(cursor);

    assert.strictEqual(result.length, 1, 'Expected 1');
    assert.deepStrictEqual(result, [ { city: 'Beijing', country: 'China' } ], 'Expected equal data');
  });
})
