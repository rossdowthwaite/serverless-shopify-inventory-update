const jsonexport = require('jsonexport');
import CsvToJson from 'csvtojson';
import { Converter } from 'csvtojson/v2/Converter';

/**
 * Helper function to convert an object to CSV string
 * @private
 * @static
 * @param  {object} objectToConvert
 * @return Promise<string>
 */
export function objectToCsv(objectToConvert: object): Promise<string> {
  return new Promise(async (resolve, reject) => {
    jsonexport(objectToConvert, { endOfLine: '\n' }, function(
      err: Error,
      csv: string
    ) {
      if (err) {
        reject(err);
      }
      resolve(csv);
    });
  });
}

/**
 * Helper function to convert a CSV string to an object
 * @private
 * @static
 * @param  {object} csvStringToConvert
 * @return Promise<string>
 */
export function csvToObject(csvStringToConvert: string): Converter {
  return CsvToJson({}).fromString(csvStringToConvert);
}
