import Database from './database.js';
import Cursor from '@/week-4/factory-method/1-module/lib/cursor';

declare class LineCursor<T> extends Cursor<T> {
  constructor(
    storage: Database<T>,
    query: Partial<T>,
  );
}

export default LineCursor;
