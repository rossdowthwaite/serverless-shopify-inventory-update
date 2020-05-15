import {
  ErrorOutput,
  WarnOutput,
  InfoOutput,
  DebugOutput,
} from '../interfaces/logger';

export abstract class LoggerLevelsService {
  /**
   * Determines whether a log should show depending on the env and log type
   *
   * @static
   * @param {(InfoOutput | WarnOutput | ErrorOutput)} output
   * @returns {boolean}
   * @memberof Logger
   */
  static shouldLog(
    output: InfoOutput | WarnOutput | ErrorOutput | DebugOutput
  ): boolean {
    const { environment, type } = output;

    const logLevelFor = this.getLogLevels();
    const envLevelFor = this.getEnvLevels();

    return envLevelFor[environment] >= logLevelFor[type];
  }

  /**
   * The logging levels per environment
   *
   * # prod       - only show critical errors
   * # preprod    - only errors and warnings
   * # test       - show all
   * # test-auto  - show all
   * # dev        - show all
   * # dev1       - show all
   * # dev2       - show all
   *
   * @static
   * @returns
   * @memberof Logger
   */
  static getEnvLevels() {
    return {
      prod: 0,
      preprod: 1,
      test: 2,
      'test-auto': 2,
      dev: 2,
      dev1: 2,
      dev2: 2,
      'not-set': 2,
    };
  }

  /**
   * The log levels
   *
   * @static
   * @returns
   * @memberof Logger
   */
  static getLogLevels() {
    return {
      info: 0,
      error: 0,
      warn: 1,
      debug: 2,
    };
  }
}
