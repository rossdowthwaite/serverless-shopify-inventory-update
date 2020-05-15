import { LoggerDataService } from '../services/logger-data.service';
import { LoggerLevelsService } from '../services/logger-levels.service';

// Interfaces
import {
  ErrorOutput,
  WarnOutput,
  InfoOutput,
  LogType,
  LogOutput,
  DebugOutput,
} from '../interfaces/logger';

// ## Improvements

// - Adjust log() to work more like console.log() and accept any length of arguments each with any possible type

export abstract class Logger {
  /**
   * Logs out an error as JSON
   * @static
   * @param {*} error
   * @returns {ErrorOutput}
   * @memberof Logger
   */
  static error(error: any): ErrorOutput {
    // Error.prototype properties
    const { message, name: errorType, stack } = error;

    // Project specific properties
    const { environment, project } = LoggerDataService.getMetadata();

    const output: ErrorOutput = {
      type: 'error',
      icon: '💥💥💥',
      environment,
      project,
      errorType,
      message,
      stack,
    };

    return <ErrorOutput>this.logOutput(output);
  }

  /**
   * Logs info
   *
   * @static
   * @param {any[]} message
   * @returns
   * @memberof Logger
   */
  static info(...message: any[]): InfoOutput {
    const output = this.generateLog(message, 'info');
    return <InfoOutput>this.logOutput(output);
  }

  /**
   * Logs a warning
   *
   * @static
   * @param {any[]} message
   * @returns
   * @memberof Logger
   */
  static warn(...message: any[]): WarnOutput {
    const output = this.generateLog(message, 'warn');
    return <WarnOutput>this.logOutput(output);
  }

  static debug(...message: any[]): DebugOutput {
    const output = this.generateLog(message, 'debug');
    return <DebugOutput>this.logOutput(output);
  }

  /**
   * Generates the log data for an Info or Warn log
   *
   * @static
   * @param {any[]} messages
   * @param {LogType} type
   * @returns {(WarnOutput | InfoOutput)}
   * @memberof Logger
   */
  static generateLog(messages: any[], type: LogType): WarnOutput | InfoOutput {
    const { environment, project } = LoggerDataService.getMetadata();

    const message = messages.map((item: any) => {
      if (Array.isArray(item) || typeof item === 'object') {
        item = JSON.stringify(item);
      }
      return item;
    });

    let icon = '💬';
    if (type === 'warn') {
      icon = '🔔🔔🔔';
    }
    if (type === 'debug') {
      icon = '🐞';
    }

    const output: LogOutput = {
      type,
      icon,
      environment,
      project,
      message: message.join(', '),
    };

    return type === 'warn' ? <WarnOutput>output : <InfoOutput>output;
  }

  /**
   * Checks if should log, and logs, or not :)
   *
   * @static
   * @param {(ErrorOutput | WarnOutput | InfoOutput)} output
   * @returns
   * @memberof Logger
   */
  static logOutput(
    output: ErrorOutput | WarnOutput | InfoOutput | DebugOutput
  ) {
    if (LoggerLevelsService.shouldLog(output)) {
      console.log(output);
    }
    return output;
  }
}
