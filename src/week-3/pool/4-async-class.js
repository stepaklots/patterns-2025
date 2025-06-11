'use strict';

class Factory {
  #method;
  #options;
  constructor(method, options) {
    this.#method = method;
    this.#options = options;
  }

  create() {
    return this.#method(...this.#options);
  }
}

class Pool {
  #factory;
  #max;
  #instances;
  #acquireQueue = [];

  constructor(factory, { size, max }) {
    this.#factory = factory;
    this.#max = max;
    this.#instances = new Array(size)
      .fill(null)
      .map(() => this.#factory.create());
  }

  async acquire(callback) {
    const instance = this.#instances.pop();
    let result;
    if (instance) {
      result = Promise.resolve(instance).then(callback);
    } else {
      const { resolve, promise } = Promise.withResolvers();
      promise.then(callback);
      this.#acquireQueue.push(resolve);
      result = promise;
    }
    return result;
  }

  release(instance) {
    if (this.#acquireQueue.length > 0) {
      const resolve = this.#acquireQueue.shift();
      resolve(instance);
      return;
    }

    if (this.#instances.length < this.#max) {
      this.#instances.push(instance);
    }
  }
}

// Usage

const createBuffer = (size) => new Uint8Array(size);
const FILE_BUFFER_SIZE = 4096;

const factory = new Factory(
  createBuffer,
  [FILE_BUFFER_SIZE],
);

const pool = new Pool(
  factory,
  { size: 2, max: 2 },
);

const callback = (instance) => {
  console.log('acquired');
  return instance;
};
const timeout = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));


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
