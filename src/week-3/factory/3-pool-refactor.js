'use strict';

const POOL_SIZE = 1000;

const poolify = ({ factory, factoryOptions, poolOptions }) => {
  const instances = new Array(poolOptions.size)
    .fill(null)
    .map(() => factory(factoryOptions));

  const acquire = () => {
    const instance = instances.pop();
    if (!instance) {
      console.warn('Pool is empty, creating a new instance');
      return factory(factoryOptions);
    }
    console.log('Get from pool, count =', instances.length);
    return instance;
  };

  const release = (instance) => {
    if (instances.length >= poolOptions.size) {
      console.warn('Pool is full, cannot recycle item');
      return;
    }
    instances.push(instance);
    console.log('Recycle item, count =', instances.length);
  };

  return { acquire, release };
};

// Usage

const factory = ({ size, initValue }) => new Array(size).fill(initValue);
const arrayPool = poolify({
  factory,
  factoryOptions: {
    size: 1000,
    initValue: 0,
  },
  poolOptions: {
    size: POOL_SIZE,
  }
});

const a1 = arrayPool.acquire();
const b1 = a1.map((x, i) => i).reduce((x, y) => x + y);
console.log(b1);

const a2 = factory({ size: 1000, initValue: 0 });
const b2 = a2.map((x, i) => i).reduce((x, y) => x + y);
console.log(b2);

// factory(a1);
// factory(a2);

const a3 = factory({ size: 1000, initValue: 0 });
const b3 = a3.map((x, i) => i).reduce((x, y) => x + y);
console.log(b3);

// See: https://github.com/HowProgrammingWorks/Pool
