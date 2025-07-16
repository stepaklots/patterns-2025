'use strict';

const promisify = (fn) => (...args) => {
  const promise = new Promise((resolve, reject) => {
    const { timeout } = args.pop();
    let isTimeoutFired = false;
    const timer = setTimeout(() => {
      isTimeoutFired = true;
      reject(new Error(`Operation timed out after ${timeout} ms`));
    }, timeout);

    const callback = (err, data) => {
      if (!isTimeoutFired) clearTimeout(timer);
      if (err) reject(err);
      else resolve(data);
    };
    fn(...args, callback);
  });
  return promise;
};

// Usage

const fs = require('node:fs');
const read = promisify(fs.readFile);

const main = async () => {
  const fileName = '1-promisify.js';
  const data = await read(fileName, 'utf8');
  console.log(`File "${fileName}" size: ${data.length}`);
};

main();

