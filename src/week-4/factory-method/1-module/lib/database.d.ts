import Cursor from '@/week-4/factory-method/1-module/lib/cursor';

declare class Database<T> {
  constructor();
  select(query: Partial<T>): Cursor<T[]>;
}

export default Database;
