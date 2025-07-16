'use strict';

class Timer {
  #counter = 0;
  #resolves = [];

  constructor(delay) {
    setInterval(() => {
      this.#counter++;
      for (let resolve of this.#resolves) {
        resolve({
          value: this.#counter,
          done: false,
        })
      }
    }, delay);
  }

  [Symbol.asyncIterator]() {
    const next = () => new Promise((resolve) => {
      this.#resolves.push(resolve);
    });
    return { next };
  }
}

// Usage

const main = async () => {
  const timer = new Timer(1000);

  (async () => {
    console.log('Section 1 start');
    for await (const step of timer) {
      console.log({ section: 1, step });
    }
  })();

  (async () => {
    console.log('Section 2 start');
    const iter = timer[Symbol.asyncIterator]();
    do {
      const { value, done } = await iter.next();
      console.log({ section: 2, step: value, done });
    } while (true);
  })();

  (async () => {
    console.log('Section 3 start');
    const iter = timer[Symbol.asyncIterator]();
    do {
      const { value, done } = await iter.next();
      console.log({ section: 3, step: value, done });
    } while (true);
  })();
};

main();
