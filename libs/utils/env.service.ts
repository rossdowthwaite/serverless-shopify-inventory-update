import dotenv from 'dotenv';

// Load variables from .env files on non-Lambda environments (e.g. local development)
if (!process.env.hasOwnProperty('AWS_EXECUTION_ENV')) {
  dotenv.config();
}

export abstract class EnvService {
  /**
   * Given a label, will retrieve the param from .env file
   * Or throw an error if it does not exist
   * @static
   * @param {string} label
   * @returns
   * @memberof EnvService
   */
  static getParam(label: string, silentFail: boolean = false) {
    const value = process.env[label];
    if (value) {
      return value;
    } else {
      if (silentFail) {
        return 'not-set';
      } else {
        throw new Error(`Value of ${label} does not exist`);
      }
    }
  }

  /**
   * Given a label, will set or update env variable in this execution context
   * @static
   * @param {string} label
   * @returns
   * @memberof EnvService
   */
  static setParam(label: string, value: string) {
    process.env[label] = value;
  }
}
