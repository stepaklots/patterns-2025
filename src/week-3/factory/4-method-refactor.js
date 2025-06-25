'use strict';

class Product {
  constructor(value) {
    this.field = value;
  }
}

class Creator {
  #args;
  constructor(...args) {
    this.#args = args;
  }
  factoryMethod() {
    return new Product(...this.#args);
  }
}

// Usage

const creator = new Creator('value');
console.dir(creator);
const product = creator.factoryMethod();
console.dir(product);
