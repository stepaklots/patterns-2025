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
  #createdTotal;
  #acquireQueue = [];

  constructor(factory, { size, max }) {
    this.#factory = factory;
    this.#max = max;
    this.#instances = new Array(size)
      .fill(null)
      .map(() => this.#factory.create());
    this.#createdTotal = this.#instances.length;
  }

  acquire(callback) {
    let instance = this.#instances.pop();
    if (!instance && this.#instances.length < this.#max) {
      instance = this.#factory.create();
      this.#createdTotal++;
    }

    if (instance) {
      process.nextTick(() => callback(instance));
    } else {
      this.#acquireQueue.push(callback);
    }
  }

  release(instance) {
    if (this.#acquireQueue.length > 0) {
      const callback = this.#acquireQueue.shift();
      process.nextTick(() => callback(instance));
      return;
    }
    this.#instances.push(instance);
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

const callback = (instance) => {
  console.log(`acquired instance`);
  pool.release(instance);
  console.log(`released instance`);
};

pool.acquire(callback);
pool.acquire(callback);
pool.acquire(callback);
pool.acquire(callback);
