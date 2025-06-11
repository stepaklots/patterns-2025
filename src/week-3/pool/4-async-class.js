'use strict';

class Factory {
  #method;
  #args;
  constructor({ method, args }) {
    this.#method = method;
    this.#args = args;
  }

  create() {
    return this.#method(this.#args);
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

  acquire(callback) {
    const instance = this.#instances.pop();
    if (instance) {
      callback(instance);
    } else {
      this.#acquireQueue.push(callback);
    }
  }

  release(instance) {
    if (this.#acquireQueue.length > 0) {
      const callback = this.#acquireQueue.shift();
      callback(instance);
      return;
    }

    if (this.#instances.length < this.#max) {
      this.#instances.push(instance);
    }
  }
}

// Usage

const createBuffer = ({ size }) => new Uint8Array(size);
const bufferArgs = { size: 4096 };

const factory = new Factory({
  method: createBuffer,
  args: bufferArgs,
});

const pool = new Pool(
  factory,
  { size: 2, max: 2 },
);

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
