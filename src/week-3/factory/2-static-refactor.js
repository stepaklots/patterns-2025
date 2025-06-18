'use strict';

class Person {
  constructor(name) {
    this.name = name;
  }
}

const factory = (name) => {
  return new Person(name);
}

module.exports = {
  Person,
  factory
}
