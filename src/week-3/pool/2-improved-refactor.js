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
  constructor(factory, { size, max }) {
    this.#factory = factory;
    this.#max = max;
    this.#instances = new Array(size)
      .fill(null)
      .map(() => this.#factory.create());
  }

  acquire() {
    return this.#instances.pop() || this.#factory.create();
  }

  release(instance) {
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
  { size: 10, max: 15 },
);

const instance = pool.acquire();
console.log({ instance });
pool.release(instance);
