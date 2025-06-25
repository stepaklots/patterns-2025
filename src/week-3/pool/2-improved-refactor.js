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
  constructor(factory, { size, max }) {
    this.#factory = factory;
    this.#max = max;
    this.#instances = new Array(size)
      .fill(null)
      .map(() => this.#factory.create());
    this.#createdTotal = this.#instances.length;
  }

  acquire() {
    const instance = this.#instances.pop();
    if (instance) return instance;
    if (this.#createdTotal < this.#max) {
      const newInstance = this.#factory.create();
      this.#createdTotal++;
      return newInstance;
    }
    return null;
  }

  release(instance) {
    this.#instances.push(instance);
  }
}

// Usage

const createBuffer = ({ size }) => new Uint8Array(size);
const FILE_BUFFER_SIZE = 4096;

const factory = new Factory({
  method: createBuffer,
  args: { size: FILE_BUFFER_SIZE },
});

const pool = new Pool(
  factory,
  { size: 10, max: 15 },
);

const instance = pool.acquire();
console.log({ instance });
pool.release(instance);
