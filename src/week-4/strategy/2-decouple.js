'use strict';

const selectStrategy = require('./1-select-strategy.js');

const RENDERERS = {
  abstract: () => {
    return 'Not implemented';
  },

  console: (data) => {
    const padLength = 20;
    const header = Object.keys(data[0])
      .map(key => key.padStart(padLength))
      .join('|');
    const dataRows = data.map(
      (row) => Object.values(row)
        .map((value) => value.toString().padStart(padLength))
        .join('|')
    );
    return [
      header,
      '-'.repeat(Object.keys(data[0]).length * padLength),
      ...dataRows
    ].join('\n');
  },

  web: (data) => {
    const keys = Object.keys(data[0]);
    const line = (row) =>
      '<tr>' + keys.map((key) => `<td>${row[key]}</td>`).join('') + '</tr>';
    const output = [
      '<table><tr>',
      keys.map((key) => `<th>${key}</th>`).join(''),
      '</tr>',
      data.map(line).join(''),
      '</table>',
    ];
    return output.join('');
  },

  markdown: (data) => {
    const keys = Object.keys(data[0]);
    const line = (row) =>
      '|' + keys.map((key) => `${row[key]}`).join('|') + '|\n';
    const output = [
      '|',
      keys.map((key) => `${key}`).join('|'),
      '|\n',
      '|',
      keys.map(() => '---').join('|'),
      '|\n',
      data.map(line).join(''),
    ];
    return output.join('');
  },
};

const printGroup = (title, data) => {
  console.group(title);
  console.log(data);
  console.groupEnd();
};

// Usage

const png = selectStrategy(RENDERERS, 'png');
const con = selectStrategy(RENDERERS, 'console');
const web = selectStrategy(RENDERERS, 'web');
const mkd = selectStrategy(RENDERERS, 'markdown');

const persons = [
  { name: 'Marcus Aurelius', city: 'Rome', born: 121 },
  { name: 'Victor Glushkov', city: 'Rostov on Don', born: 1923 },
  { name: 'Ibn Arabi', city: 'Murcia', born: 1165 },
  { name: 'Mao Zedong', city: 'Shaoshan', born: 1893 },
  { name: 'Rene Descartes', city: 'La Haye en Touraine', born: 1596 },
];

printGroup('Unknown Strategy:', png(persons));
printGroup('\nConsoleRenderer:', con(persons));
printGroup('\nWebRenderer:', web(persons));
printGroup('\nMarkdownRenderer:', mkd(persons));
