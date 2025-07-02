import Database from './database.js';
import Cursor from '@/week-4/factory-method/1-module/lib/cursor';

declare class FileStorage<T> extends Database<T> {
  constructor(fileName: string);
  select(query: Partial<T>): Cursor<T[]>;
}

export default FileStorage;
