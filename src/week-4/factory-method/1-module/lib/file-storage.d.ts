import Database from './database.js';
import Data from '@/week-4/factory-method/1-module/lib/data';

declare class FileStorage extends Database {
  constructor(fileName: string);
  select(query: Partial<Data>): Promise<Data[]>;
}

export default FileStorage;
