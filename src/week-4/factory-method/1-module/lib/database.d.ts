import Data from '@/week-4/factory-method/1-module/lib/data';

declare class Database {
  constructor();
  select(query: Partial<Data>): Promise<Data[]>;
}

export default Database;
