import Data from './data.js';

declare class Cursor implements AsyncIterable<Data> {
  current: number;
  constructor();
  [Symbol.asyncIterator](): AsyncIterator<Data>;
}

export default Cursor;
