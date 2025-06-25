const test = require('node:test');
const assert = require('assert');
const { parseCsv, normalize, sort, pad } = require('./4-functional');

test('it parses CSV input', () => {
  const testData = `city,population,area,density,country
    Shanghai,24256800,6340,3826,China
    Delhi,16787941,1484,11313,India
    Bangkok,8280925,1569,5279,Thailand`;
  const result = parseCsv(testData, true);

  assert.deepStrictEqual(
    result.header,
    ['city', 'population', 'area', 'density', 'country'],
  );
  assert.deepStrictEqual(
    result.data,
    [
      ['Shanghai', '24256800', '6340', '3826', 'China'],
      ['Delhi', '16787941', '1484', '11313', 'India'],
      ['Bangkok', '8280925', '1569', '5279', 'Thailand'],
    ]);
});

test('it normalizes data', () => {
  const header = ['city', 'population', 'area', 'density', 'country'];
  const data = [
    ['Shanghai', '24256800', '6340', '3826', 'China'],
    ['Delhi', '16787941', '1484', '11313', 'India'],
    ['Bangkok', '8280925', '1569', '5279', 'Thailand'],
  ];

  const result = normalize(
    'density',
    'normalized-density',
    { header, data },
  );

  assert.deepStrictEqual(
    result.header,
    ['city', 'population', 'area', 'density', 'country', 'normalized-density'],
  );
  assert.deepStrictEqual(
    result.data,
    [
      ['Shanghai', '24256800', '6340', '3826', 'China', '34'],
      ['Delhi', '16787941', '1484', '11313', 'India', '100'],
      ['Bangkok', '8280925', '1569', '5279', 'Thailand', '47'],
    ]
  );
});

test('it sorts data', () => {
  const header = ['city', 'population', 'area', 'density', 'country'];
  const data = [
    ['Shanghai', '24256800', '6340', '3826', 'China'],
    ['Delhi', '16787941', '1484', '11313', 'India'],
    ['Bangkok', '8280925', '1569', '5279', 'Thailand'],
  ];

  const result = sort(
    'population',
    { header, data },
  );

  assert.deepStrictEqual(
    result.header,
    ['city', 'population', 'area', 'density', 'country']
  );
  assert.deepStrictEqual(
    result.data,
    [
      ['Shanghai', '24256800', '6340', '3826', 'China'],
      ['Delhi', '16787941', '1484', '11313', 'India'],
      ['Bangkok', '8280925', '1569', '5279', 'Thailand'],
    ]
  );
});


test('it adds padding to data', () => {
  const header = ['city', 'population', 'area', 'density', 'country'];
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

  const result = pad(
    paddingConfig,
    { header, data },
  );

  assert.deepStrictEqual(
    result.data,
    [
      ['Shanghai          ', '  24256800', '    6340', '    3826', '             China'],
      ['Delhi             ', '  16787941', '    1484', '   11313', '             India'],
      ['Bangkok           ', '   8280925', '    1569', '    5279', '          Thailand']
    ]
  );
});
