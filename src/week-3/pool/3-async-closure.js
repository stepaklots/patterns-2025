'use strict';

const poolify = ({ factory, size, max }) => {
  const instances = new Array(size)
    .fill(null)
    .map(factory);

  const acquireQueue = [];

  const acquire = (callback) => {
    const instance = instances.pop();
    if (instance) {
      return callback(instance);
    } else {
      acquireQueue.push(callback);
    }
  }

  const release = (instance) => {
    if (acquireQueue.length > 0) {
      const callback = acquireQueue.shift();
      callback(instance);
      return;
    }

    if (instances.length < max) {
      instances.push(instance);
    }
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

const timeout = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

const callback = async (instance) => {
  console.log(`using`);
  await timeout(2);
  console.log(`releasing`);
  pool.release(instance);
};

pool.acquire(callback);
pool.acquire(callback);
pool.acquire(callback);
pool.acquire(callback);
