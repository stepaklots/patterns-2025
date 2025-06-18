const test = require('node:test');
const assert = require('assert');
const { parseCsv, normalize, sort, addPadding } = require('./3-procedural');

test('It parses CSV input', () => {
  const testData = `city,population,area,density,country
    Shanghai,24256800,6340,3826,China
    Delhi,16787941,1484,11313,India
    Bangkok,8280925,1569,5279,Thailand`;
  const result = parseCsv({
    input: testData,
    withHeader: true,
    delimiter: ',',
    lineBreaker: '\n'
  });

  assert.deepStrictEqual(
    result.columnNames,
    ['city', 'population', 'area', 'density', 'country']
  );
  assert.deepStrictEqual(
    result.data,
    [
      ['Shanghai', '24256800', '6340', '3826', 'China'],
      ['Delhi', '16787941', '1484', '11313', 'India'],
      ['Bangkok', '8280925', '1569', '5279', 'Thailand']
    ]);
});

test('It normalizes data', () => {
  const headerRow = ['city', 'population', 'area', 'density', 'country'];
  const data = [
    ['Shanghai', '24256800', '6340', '3826', 'China'],
    ['Delhi', '16787941', '1484', '11313', 'India'],
    ['Bangkok', '8280925', '1569', '5279', 'Thailand']
  ];

  normalize({
    input: data,
    columnNames: headerRow,
    normalizeBy: 'density',
    newColumnName: 'normalized-density'
  });

  assert.deepStrictEqual(
    headerRow,
    ['city', 'population', 'area', 'density', 'country', 'normalized-density']
  );
  assert.deepStrictEqual(
    data,
    [
      ['Shanghai', '24256800', '6340', '3826', 'China', '34'],
      ['Delhi', '16787941', '1484', '11313', 'India', '100'],
      ['Bangkok', '8280925', '1569', '5279', 'Thailand', '47']
    ]
  );
});

test('It sorts data', () => {
  const headerRow = ['city', 'population', 'area', 'density', 'country'];
  const data = [
    ['Shanghai', '24256800', '6340', 3826, 'China'],
    ['Delhi', '16787941', '1484', 11313, 'India'],
    ['Bangkok', '8280925', '1569', 5279, 'Thailand']
  ];

  sort({
    input: data,
    columnNames: headerRow,
    sortBy: 'density',
    sortOrder: 'DESC'
  });

  assert.deepStrictEqual(
    data,
    [
      ['Delhi', '16787941', '1484', 11313, 'India'],
      ['Bangkok', '8280925', '1569', 5279, 'Thailand'],
      ['Shanghai', '24256800', '6340', 3826, 'China']
    ]
  );
});

test('It adds padding to data', () => {
  const headerRow = ['city', 'population', 'area', 'density', 'country'];
  const data = [
    ['Shanghai', '24256800', '6340', '3826', 'China'],
    ['Delhi', '16787941', '1484', '11313', 'India'],
    ['Bangkok', '8280925', '1569', '5279', 'Thailand']
  ];

  const paddingConfig = [
    { name: 'city', length: 18, align: 'left' },
    { name: 'population', length: 10, align: 'right' },
    { name: 'area', length: 8, align: 'right' },
    { name: 'density', length: 8, align: 'right' },
    { name: 'country', length: 18, align: 'right' },
    { name: 'normalized-density', length: 6, align: 'right' }
];

  addPadding({
    input: data,
    columnNames: headerRow,
    config: paddingConfig,
  });

  assert.deepStrictEqual(
    data,
    [
      ['Shanghai          ', '  24256800', '    6340', '    3826', '             China'],
      ['Delhi             ', '  16787941', '    1484', '   11313', '             India'],
      ['Bangkok           ', '   8280925', '    1569', '    5279', '          Thailand']
    ]
  );
});
