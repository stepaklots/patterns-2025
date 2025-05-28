'use strict';

const purchase = [
  { name: 'Laptop', price: 1500 },
  { name: 'Mouse', price: 25 },
  { name: 'Keyboard', price: 100 },
  { name: 'HDMI cable', price: 10 },
  { name: 'Bag', price: 50 },
  { name: 'Mouse pad', price: 5 },
];

class PurchaseIterator {
  constructor(items) {
    this.items = items;
  }

  static create(items) {
    return new PurchaseIterator(items);
  }

  [Symbol.asyncIterator]() {
    let i = 0;
    const items = this.items;
    return {
      async next() {
        if (i === items.length) {
          return { done: true };
        }
        return {
          value: items[i++],
          done: false
        };
      }
    }
  }
}

class Basket {
  #resolve;
  #promise;
  #total;
  #limit;
  #items;
  #errors;

  constructor({ limit }) {
    const { promise, resolve } = Promise.withResolvers();
    this.#resolve = resolve;
    this.#promise = promise;
    this.#total = 0;
    this.#limit = limit;
    this.#items = [];
    this.#errors = [];
  }

  add(item) {
    const newAmount = this.#total + item.price;
    if (newAmount > this.#limit) {
      const error = `Unable to add ${JSON.stringify(item)}, total exceeds limit`;
      this.#errors.push(error);
      return;
    }
    this.#items.push(item);
    this.#total = newAmount;
  }

  complete() {
    const total = this.#total;
    const items = this.#items;
    this.#resolve({ errors: this.#errors, items, total });
  }

  then(result) {
    this.#promise.then(result);
  }
}

const basketLogger = async (basket) => {
  const { errors, items, total } = await basket;
  for (let error of errors) {
    console.log(error);
  }
  for (let item of items) {
    console.log(item);
  }
  console.log(`Total: ${total}`);
}

const main = async () => {
  const goods = PurchaseIterator.create(purchase);
  const basket = new Basket({ limit: 1050 });

  basketLogger(basket);

  for await (const item of goods) {
    basket.add(item);
  }
  basket.complete();
};

main();
