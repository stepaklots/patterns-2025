'use strict';

const poolify = ({ factory, size, max }) => {
  const createInstance = () => factory.method(...factory.options);

  const instances = new Array(size)
    .fill(null)
    .map(createInstance);

  const acquireQueue = [];

  const acquire = async (callback) => {
    const instance = instances.pop();
    if (instance) {
      return Promise.resolve(instance).then(callback);
    } else {
      const { resolve, promise } = Promise.withResolvers();
      promise.then(callback);
      acquireQueue.push(resolve);
      return promise;
    }
  }

  const release = (instance) => {
    if (acquireQueue.length > 0) {
      const resolve = acquireQueue.shift();
      resolve(instance);
      return;
    }

    if (instances.length < max) {
      instances.push(instance);
    }
  }

  return { acquire, release };
};

// Usage

const createBuffer = (size) => new Uint8Array(size);
const pool = poolify({
  factory: {
    method: createBuffer,
    options: [4096],
  },
  size: 2,
  max: 2,
});

const callback = (instance) => {
  console.log(`acquired`);
  return instance;
};
const timeout = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

const main = () => {
  Array.from([
    pool.acquire(callback),
    pool.acquire(callback),
    pool.acquire(callback),
    pool.acquire(callback),
  ])
    .map(async (promise) => {
      const instance = await promise;
      console.log(`using`);
      await timeout(2);
      console.log(`releasing`);
      pool.release(instance);
    });
};

main();
