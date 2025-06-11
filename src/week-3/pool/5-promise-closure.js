'use strict';

const poolify = ({ factory, size, max }) => {
  const createInstance = () => factory.method(factory.args);

  const instances = new Array(size)
    .fill(null)
    .map(createInstance);

  const requestQueue = [];

  const acquire = async () => {
    return new Promise((resolve) => {
      const instance = instances.pop();
      if (instance) {
        resolve(instance);
      } else {
        requestQueue.push(resolve);
      }
    });
  }

  const release = (instance) => {
    if (requestQueue.length > 0) {
      const resolve = requestQueue.shift();
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

const createBuffer = ({ size }) => new Uint8Array(size);
const bufferArgs = { size: 4096 };
const pool = poolify({
  factory: {
    method: createBuffer,
    args: bufferArgs,
  },
  size: 2,
  max: 2,
});
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
