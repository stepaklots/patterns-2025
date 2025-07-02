'use strict';

class Database {
  constructor() {
    const proto = Object.getPrototypeOf(this);
    if (proto.constructor === Database) {
      throw new Error('Abstract class should not be instanciated');
    }
  }

  select() {
    throw new Error('Method is not implemented');
  }
}

module.exports = Database;
