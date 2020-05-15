import { Logger } from './logger.service';
import { EnvService } from '../../utils/env.service';

describe('LoggerService', () => {
  beforeEach(() => {
    spyOn(console, 'log');
    spyOn(EnvService, 'getParam').and.callFake((arg: string) => {
      switch (arg) {
        case 'ENVIRONMENT':
          return 'ENVIRONMENT';
        case 'PROJECT':
          return 'PROJECT';
        default:
          return '';
      }
    });
  });

  describe('error()', () => {
    it('Should log the correct error type', () => {
      // Error
      let logErrorResult;

      try {
        throw new Error('Error message');
      } catch (error) {
        logErrorResult = Logger.error(error);
      }

      expect(logErrorResult.type).toEqual('error');
      expect(logErrorResult.errorType).toEqual('Error');

      // SyntaxError
      let logSyntaxErrorResult;

      try {
        throw new SyntaxError('Error message');
      } catch (error) {
        logSyntaxErrorResult = Logger.error(error);
      }

      expect(logSyntaxErrorResult.type).toEqual('error');
      expect(logSyntaxErrorResult.errorType).toEqual('SyntaxError');
    });

    it('Should log the error message and stack trace', () => {
      let logErrorResult;

      try {
        throw new Error('Error message');
      } catch (error) {
        logErrorResult = Logger.error(error);
      }

      expect(logErrorResult.message).toEqual('Error message');
      expect(logErrorResult.stack.length).toBeGreaterThan(0);
    });
  });

  describe('info()', () => {
    it('Should log info', () => {
      const logResult1 = Logger.info('message');
      expect(logResult1.type).toEqual('info');

      const logResult2 = Logger.info('message');
      expect(logResult2.type).toEqual('info');
    });

    it('Should log an info message', () => {
      const logResult1 = Logger.info('message');
      expect(logResult1.message).toEqual('message');

      const logResult2 = Logger.info('message');
      expect(logResult2.message).toEqual('message');
    });

    it('Should log the env and project name', () => {
      const logResult = Logger.info('message');

      expect(logResult.project).toEqual('PROJECT');
      expect(logResult.environment).toEqual('ENVIRONMENT');
    });
  });

  describe('warn()', () => {
    it('Should log a warning', () => {
      const logResult = Logger.warn('message');
      expect(logResult.type).toEqual('warn');
    });

    it('Should log a warn message', () => {
      const logResult = Logger.warn('message');
      expect(logResult.message).toEqual('message');
    });

    it('Should log the env and project name', () => {
      const logResult = Logger.warn('message');

      expect(logResult.project).toEqual('PROJECT');
      expect(logResult.environment).toEqual('ENVIRONMENT');
    });
  });

  describe('debug()', () => {
    it('Should log a debug', () => {
      const logResult = Logger.debug('message');
      expect(logResult.type).toEqual('debug');
    });

    it('Should log a debug message', () => {
      const logResult = Logger.debug('message');
      expect(logResult.message).toEqual('message');
    });

    it('Should log the env and project name', () => {
      const logResult = Logger.debug('message');

      expect(logResult.project).toEqual('PROJECT');
      expect(logResult.environment).toEqual('ENVIRONMENT');
    });
  });

  describe('generateLog', () => {
    it('Should generate data for a warn log', () => {
      const result = Logger.generateLog(['hello'], 'warn');
      expect(result.type).toEqual('warn');
    });

    it('Should generate data for a info', () => {
      const result = Logger.generateLog(['hello'], 'info');
      expect(result.type).toEqual('info');
    });

    it('Should stringify the item if is an array', () => {
      spyOn(JSON, 'stringify');
      Logger.generateLog([['hello']], 'info');
      expect(JSON.stringify).toHaveBeenCalledWith(['hello']);
    });
  });
});
