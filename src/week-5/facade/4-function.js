'use strict';

const timeoutCollection = (interval) => {
  const collection = new Map();
  const expiration = new Map();

  const isExpired = (key) => {
    const expiryTime = expiration.get(key);
    if (!expiryTime) return false;
    return Date.now() > expiryTime;
  }

  const set = (key, value) => {
    collection.set(key, value);
    expiration.set(key, Date.now() + interval);
  };

  const get = (key) => {
    if (isExpired(key)) {
      remove(key);
      return null;
    }
    collection.get(key);
  }

  const remove = (key) => {
    collection.delete(key);
    expiration.delete(key);
  };

  const toArray = () => {
    const now = Date.now();
    return [...collection.entries()].filter(([key]) => {
      const expiryTime = expiration.get(key);
      return expiryTime && expiryTime > now;
    });
  };

  return { set, get, remove, toArray };
};

// Usage

const hash = timeoutCollection(1000);
hash.set('uno', 1);
console.dir({ array: hash.toArray() });

hash.set('due', 2);
console.dir({ array: hash.toArray() });

setTimeout(() => {
  hash.set('tre', 3);
  console.dir({ array: hash.toArray() });

  setTimeout(() => {
    hash.set('quattro', 4);
    console.dir({ array: hash.toArray() });
  }, 500);
}, 1500);
