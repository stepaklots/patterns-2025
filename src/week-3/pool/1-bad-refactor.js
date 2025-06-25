'use strict';

const poolify = ({ factory, size, max }) => {
  const createInstance = () => factory();
  const instances = new Array(size)
    .fill(null)
    .map(createInstance);
  let createdTotal = instances.length;

  const acquire = () => {
    const instance = instances.pop();
    if (instance) return instance;
    if (createdTotal < max) {
      const newInstance = createInstance();
      createdTotal++;
      return newInstance;
    }
    return null;
  }

  const release = (instance) => instances.push(instance);

  return { acquire, release };
};

// Usage

const createBuffer = ({ size }) => () => new Uint8Array(size);
const bufferArgs = { size: 4096 };
const pool = poolify({
  factory: createBuffer(bufferArgs),
  size: 10,
  max: 15,
});

const instance = pool.acquire();
console.log({ instance });
pool.release(instance);
