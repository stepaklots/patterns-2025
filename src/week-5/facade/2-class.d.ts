declare class TimeoutCollection<K, V> implements Map<K, V> {
  constructor(timeout: number);

  readonly size: number;

  has(key: K): boolean;
  set(key: K, value: V): this;
  get(key: K): V | undefined;
  delete(key: K): boolean;
  clear(): void;
  toArray(): [K, V][];
  forEach(callback: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
  keys(): MapIterator<K>;
  values(): MapIterator<V>;
  entries(): MapIterator<[K, V]>;
  [Symbol.iterator](): MapIterator<[K, V]>;
  [Symbol.toStringTag]: string;
}

export = TimeoutCollection;
