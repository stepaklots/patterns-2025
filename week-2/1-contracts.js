'use strict';

const purchase = [
  { name: 'Laptop',  price: 1500 },
  { name: 'Mouse',  price: 25 },
  { name: 'Keyboard',  price: 100 },
  { name: 'HDMI cable',  price: 10 },
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
  #limit;
  #items = [];
  #total = 0;
  #callback;

  constructor({ limit }, callback) {
    this.#limit = limit;
    this.#callback = callback;
  }

  add(item) {
    this.#addPromise(item);
  }

  #addPromise(item) {
    return new Promise((resolve, reject) => {
      const newAmount = this.#total + item.price;
      if (newAmount > this.#limit) {
        reject(`Unable to add item ${JSON.stringify(item)}, total exceeds limit`);
        return;
      }
      this.#items.push(item);
      this.#total = newAmount;
      resolve(item);
    })
      .then((result) => {
        console.log(`Added to basket: ${JSON.stringify(result)}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  then() {
    this.#callback(this.#items, this.#total);
  }
}

const main = async () => {
  const goods = PurchaseIterator.create(purchase);
  const basket = new Basket({ limit: 1050 }, (items, total) => {
    for (let i = 0; i < items.length; i++ ) {
      console.log(`Basket item[${i + 1}]: ${JSON.stringify(items[i])}`);
    }
    console.log(`Basket total: ${total}`);
  });

  for await (const item of goods) {
    basket.add(item);
  }
  await basket;
};

main();
