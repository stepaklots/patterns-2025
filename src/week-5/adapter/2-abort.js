'use strict';

const promisify = (fn) => (...args) => {
  const promise = new Promise((resolve, reject) => {
    const { signal } = args.pop();
    let settled = false;

    const onAbort = () => {
      if (settled) return;
      settled = true;
      reject(new Error('Operation aborted'));
    };
    if (signal.aborted) {
      return onAbort();
    }
    signal.addEventListener('abort', onAbort);

    const callback = (err, data) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener('abort', onAbort);

      if (err) reject(err);
      else resolve(data);
    };
    fn(...args, callback);
  });
  return promise;
};

// Usage

const ac = new AbortController();
const abortIn = (ms) => setTimeout(() => ac.abort(), ms);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const testFn = async (callback) => {
  await delay(1000);
  callback(null, 'Test data');
};

const promise = promisify(testFn);

const main = async () => {
  promise({ signal: ac.signal })
    .then((data) => console.log(data))
    .catch((err) => console.error(err.message));
  abortIn(500);
};

main();
