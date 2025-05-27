const { Table, CsvData, DataPadConfig, PadAlign } = require('./2-mixed');

/**
 * Test area
 */

const randString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

const generateRandomNumber = (min = 1, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let testData = 'city,population,area,density,country';
const linesCount = 1000000;

for (let i = 0; i < linesCount; i++) {
  const city = randString(10);
  const population = generateRandomNumber(100000000, 1000000000);
  const area = generateRandomNumber(100000, 1000000);
  const density = generateRandomNumber(1000, 10000);
  const country = randString(10);
  const line = `${city},${population},${area},${density},${country}`;
  testData += `\n${line}`;
}

console.log(`START TEST`);
const startTime = new Date();

const csvTestData = new CsvData({
  input: testData,
  withHeader: true,
});
new Table(csvTestData.parse())
  .normalize({
    source: 'density',
    destination: '% max area',
  })
  .sort({
    columnName: '% max area',
  })
  .pad({
    config: Object.values(DataPadConfig)
  })
  .print();

const elapsed = new Date() - startTime;
console.log(`END TEST`);
console.log(`elapsed: ${elapsed} ms`);
console.log(`data length: ${linesCount}`);
