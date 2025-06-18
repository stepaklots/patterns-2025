const test = require('node:test');
const assert = require('assert');
const { factory } = require('./2-static-refactor.js');

test('It creates a person using the factory function', () => {
  const p1 = factory('Marcus');
  console.dir({ p1 });

  assert.strictEqual(p1.name, 'Marcus');
});
