'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { FileStorage } = require('./1-module');

describe('file storage module integration tests', () => {
  const iterate = async (cursor) => {
    const result = [];
    for await (const record of cursor) {
      result.push(record);
    }
    return result;
  }

  it('should iterate over stream from file', async () => {
    const fileStoragePath = path.join(__dirname, './storage-test.dat');
    const db = new FileStorage(fileStoragePath);
    const cursor = db.select();

    let result = await iterate(cursor);
    assert.deepStrictEqual(
      result,
      [
        { "city": "Kiev", "name": "Glushkov" },
        { "city": "Roma", "name": "Marcus Aurelius" },
        { "city": "Shaoshan", "name": "Mao Zedong" },
        { "city": "Roma", "name": "Lucius Verus" },
      ],
    );
  });

  it('should query data from file', async () => {
    const fileStoragePath = path.join(__dirname, './storage-test.dat');
    const db = new FileStorage(fileStoragePath);
    const cursor = db.select({ name: 'Marcus Aurelius' });

    let result = await iterate(cursor);
    assert.deepStrictEqual(
      result,
      [ { "city": "Roma", "name": "Marcus Aurelius" } ],
    );
  });
});

