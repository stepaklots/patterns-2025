'use strict';

class TimeoutCollection {
  constructor(timeout) {
    this.timeout = timeout;
    this.collection = new Map();
    this.timers = new Map();
  }

  get size() {
    return this.collection.size;
  }

  has(key) {
    return this.collection.has(key);
  }

  set(key, value) {
    const timer = this.timers.get(key);
    if (timer) clearTimeout(timer);
    const timeout = setTimeout(() => {
      this.delete(key);
    }, this.timeout);
    timeout.unref();
    this.collection.set(key, value);
    this.timers.set(key, timeout);
    return this;
  }

  get(key) {
    return this.collection.get(key);
  }

  delete(key) {
    const exists = this.collection.has(key);
    if (exists) {
      const timer = this.timers.get(key);
      clearTimeout(timer);
      this.collection.delete(key);
      this.timers.delete(key);
    }
    return exists;
  }

  toArray() {
    return [...this.collection.entries()];
  }

  forEach(callback) {
    for (const [key, value] of this.collection.entries()) {
      callback(value, key, this);
    }
  }

  clear() {
    this.collection.clear();
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }

  keys() {
    return this.collection.keys();
  }

  values() {
    return this.collection.values();
  }

  entries() {
    return this.collection.entries();
  }

  [Symbol.iterator]() {
    return this.entries();
  }

  [Symbol.toStringTag]() {
    return 'TimeoutCollection';
  }
}

module.exports = TimeoutCollection;
