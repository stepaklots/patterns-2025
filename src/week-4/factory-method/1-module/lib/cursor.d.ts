declare class Cursor<T> implements AsyncIterable<T> {
  current: number;
  constructor();
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

export default Cursor;
