import * as path from 'node:path';
import FileStorage from '@/week-4/factory-method/1-module/lib/file-storage';
import StorageData from '@/week-4/factory-method/1-module/lib/data';

const main = async () => {
  const fileStoragePath = path.join(__dirname, './storage.dat');
  const db = new FileStorage<StorageData>(fileStoragePath);

  const cursor = db.select({ city: 'Roma' });
  for await (const record of cursor) {
    console.dir(record);
  }
};

main();
