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

  async acquire() {
    return new Promise((resolve) => {
      const instance = this.#instances.pop();
      if (instance) {
        resolve(instance);
      } else {
        this.#acquireQueue.push(resolve);
      }
    });
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

const timeout = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

for (let i = 0; i < 4; i++) {
  pool.acquire()
    .then(async (instance) => {
      console.log(`using ${i + 1}`);
      await timeout(2);
      console.log(`releasing ${i + 1}`);
      pool.release(instance);
    });
}
