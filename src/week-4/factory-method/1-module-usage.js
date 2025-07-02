const path = require('node:path');
const { FileStorage } = require('./1-module');

const main = async () => {
  const fileStoragePath = path.join(__dirname, './storage.dat');
  const db = new FileStorage(fileStoragePath);

  const cursor = db.select({ city: 'Roma' });
  for await (const record of cursor) {
    console.dir(record);
  }
};

main();
