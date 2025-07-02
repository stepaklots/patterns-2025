import Database from './database.js';
import Data from './data.js';

declare class LineCursor {
  current: number;
  constructor(storage: Database, query: Partial<Data>);
  [Symbol.asyncIterator](): AsyncIterator<Data>;
}

export default LineCursor;
