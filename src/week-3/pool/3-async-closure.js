'use strict';

const poolify = ({ factory, size, max }) => {
  const instances = new Array(size)
    .fill(null)
    .map(factory);

  let createdTotal = instances.length;
  const acquireQueue = [];

  const acquire = (callback) => {
    let instance = instances.pop();
    if (!instance && createdTotal < max) {
      instance = factory();
      createdTotal++;
    }

    if (instance) {
      process.nextTick(() => {
        console.log('>> calling callback from acquire (async)');
        callback(instance);
      });
    } else {
      console.log('>> pushing to queue');
      acquireQueue.push(callback);
    }
  }

  const release = (instance) => {
    if (acquireQueue.length > 0) {
      const callback = acquireQueue.shift();
      process.nextTick(() => {
        console.log('>> calling callback from release (async)');
        callback(instance);
      });
      return;
    }
    instances.push(instance);
    console.log('>> released instance back to pool');
  }

  return { acquire, release };
};

// Usage

const createBuffer = ({ size }) => () => new Uint8Array(size);
const bufferArgs = { size: 4096 };
const pool = poolify({
  factory: createBuffer(bufferArgs),
  size: 2,
  max: 2,
});

const callback = (instance) => {
  console.log('>>> acquired instance');
  pool.release(instance);
  console.log('>>> released instance');
};

console.log('--- before acquiring ---');
pool.acquire(callback);
pool.acquire(callback);
pool.acquire(callback);
pool.acquire(callback);
console.log('--- after initiating all acquires ---');
