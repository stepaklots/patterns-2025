'use strict';

const poolify = ({ factory, size, max }) => {
  const createInstance = () => factory.method(...factory.options);

  const instances = new Array(size)
    .fill(null)
    .map(createInstance);

  const acquire = () => {
    const instance = instances.pop();
    return instance || createInstance();
  }

  const release = (instance) => {
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
  size: 10,
  max: 15,
});

const instance = pool.acquire();
console.log({ instance });
pool.release(instance);
