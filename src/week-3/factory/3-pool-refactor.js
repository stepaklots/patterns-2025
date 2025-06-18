'use strict';

const POOL_SIZE = 1000;

const poolify = (factory, options) => {
  const factoryWithOptions = factory(options.size, options.initValue);
  const instances = new Array(options.poolSize)
    .fill(null)
    .map(factoryWithOptions);

  const acquire = () => {
    const instance = instances.pop() || factoryWithOptions();
    console.log('Get from pool, count =', instances.length);
    return instance;
  };

  const release = (instance) => {
    instances.push(instance);
    console.log('Recycle item, count =', instances.length);
  };

  return { acquire, release };
};

// Usage

const factory = (size, initValue) => () => new Array(size).fill(initValue);
const arrayPool = poolify(
  factory,
  {
    size: 1000,
    initValue: 0,
    poolSize: POOL_SIZE
  }
);

const a1 = arrayPool.acquire();
const b1 = a1.map((x, i) => i).reduce((x, y) => x + y);
console.log(b1);

// const a2 = factory();
// const b2 = a2.map((x, i) => i).reduce((x, y) => x + y);
// console.log(b2);
//
// factory(a1);
// factory(a2);
//
// const a3 = factory();
// const b3 = a3.map((x, i) => i).reduce((x, y) => x + y);
// console.log(b3);

// See: https://github.com/HowProgrammingWorks/Pool
