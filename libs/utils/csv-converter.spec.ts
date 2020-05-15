import * as CsvConverter from './csv-converter';

describe('CsvConverter', () => {
  const testCsv = 'COLUMN1,COLUMN2,COLUMN3\nAccountAB17,73647634~1102,AB11 2CD';
  const testObject = [
    {
      COLUMN1: 'AccountAB17',
      COLUMN2: '73647634~1102',
      COLUMN3: 'AB11 2CD',
    },
  ];

  it('should return a CSV as a string', async () => {
    const result: string = await CsvConverter.objectToCsv(testObject);
    expect(result).toEqual(testCsv);
  });

  it('should return an object from a CSV string', async () => {
    const result: object = await CsvConverter.csvToObject(testCsv);
    expect(result).toEqual(testObject);
  });
});
