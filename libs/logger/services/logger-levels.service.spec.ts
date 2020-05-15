import { LoggerLevelsService } from './logger-levels.service';

import * as Helper from '../services/helpers/logger.service.spec.helper';

import {
  ErrorOutput,
  WarnOutput,
  InfoOutput,
  DebugOutput,
} from '../interfaces/logger';

describe('LoggerLevelsService', () => {
  describe('shouldLog()', () => {
    let mockError: ErrorOutput;
    let mockWarn: WarnOutput;
    let mockInfo: InfoOutput;
    let mockDebug: DebugOutput;

    beforeEach(() => {
      mockError = Helper.getMockErrorOutput();
      mockWarn = Helper.getMockWarnOutput();
      mockInfo = Helper.getMockInfoOutput();
      mockDebug = Helper.getMockDebugOutput();
    });

    describe('production', () => {
      beforeEach(() => {
        mockError.environment = 'prod';
        mockWarn.environment = 'prod';
        mockInfo.environment = 'prod';
        mockDebug.environment = 'prod';
      });

      it('Should return true : EnvLevel = 0, LogLevel = 0', () => {
        const result = LoggerLevelsService.shouldLog(mockError);
        expect(result).toBeTruthy();
      });
      it('Should return false: EnvLevel = 0, LogLevel = 1', () => {
        const result = LoggerLevelsService.shouldLog(mockWarn);
        expect(result).toBeFalsy();
      });
      it('Should return true: EnvLevel = 0, LogLevel = 0', () => {
        const result = LoggerLevelsService.shouldLog(mockInfo);
        expect(result).toBeTruthy();
      });
      it('Should return false: EnvLevel = 0, LogLevel = 2', () => {
        const result = LoggerLevelsService.shouldLog(mockDebug);
        expect(result).toBeFalsy();
      });
    });

    describe('pre-prod', () => {
      beforeEach(() => {
        mockError.environment = 'preprod';
        mockWarn.environment = 'preprod';
        mockInfo.environment = 'preprod';
        mockDebug.environment = 'preprod';
      });

      it('Should return true : EnvLevel = 1, LogLevel = 0 (error)', () => {
        const result = LoggerLevelsService.shouldLog(mockError);
        expect(result).toBeTruthy();
      });
      it('Should return true: EnvLevel = 1, LogLevel = 0 (info)', () => {
        const result = LoggerLevelsService.shouldLog(mockInfo);
        expect(result).toBeTruthy();
      });
      it('Should return true : EnvLevel = 1, LogLevel = 1 (warn)', () => {
        const result = LoggerLevelsService.shouldLog(mockWarn);
        expect(result).toBeTruthy();
      });
      it('Should return false: EnvLevel = 1, LogLevel = 2 (debug)', () => {
        const result = LoggerLevelsService.shouldLog(mockDebug);
        expect(result).toBeFalsy();
      });
    });

    describe('dev, test, test-auto, not-set', () => {
      beforeEach(() => {
        mockError.environment = 'dev';
        mockWarn.environment = 'dev';
        mockInfo.environment = 'dev';
        mockDebug.environment = 'dev';
      });

      it('Should return true: EnvLevel = 2, LogLevel = 0', () => {
        mockError.environment = 'dev';
        const devResult = LoggerLevelsService.shouldLog(mockError);
        expect(devResult).toBeTruthy();

        mockError.environment = 'test';
        const testResult = LoggerLevelsService.shouldLog(mockError);
        expect(testResult).toBeTruthy();

        mockError.environment = 'test-auto';
        const testAutoResult = LoggerLevelsService.shouldLog(mockError);
        expect(testAutoResult).toBeTruthy();

        mockError.environment = 'not-set';
        const notSetResult = LoggerLevelsService.shouldLog(mockError);
        expect(notSetResult).toBeTruthy();
      });

      it('Should return true: EnvLevel = 2, LogLevel = 0', () => {
        mockInfo.environment = 'dev';
        const devResult = LoggerLevelsService.shouldLog(mockInfo);
        expect(devResult).toBeTruthy();

        mockInfo.environment = 'test';
        const testResult = LoggerLevelsService.shouldLog(mockInfo);
        expect(testResult).toBeTruthy();

        mockInfo.environment = 'test-auto';
        const testAutoResult = LoggerLevelsService.shouldLog(mockInfo);
        expect(testAutoResult).toBeTruthy();

        mockInfo.environment = 'not-set';
        const notSetResult = LoggerLevelsService.shouldLog(mockInfo);
        expect(notSetResult).toBeTruthy();
      });

      it('Should return true: EnvLevel = 2, LogLevel = 1', () => {
        mockWarn.environment = 'dev';
        const devResult = LoggerLevelsService.shouldLog(mockWarn);
        expect(devResult).toBeTruthy();

        mockWarn.environment = 'test';
        const testResult = LoggerLevelsService.shouldLog(mockWarn);
        expect(testResult).toBeTruthy();

        mockWarn.environment = 'test-auto';
        const testAutoResult = LoggerLevelsService.shouldLog(mockWarn);
        expect(testAutoResult).toBeTruthy();

        mockWarn.environment = 'not-set';
        const notSetResult = LoggerLevelsService.shouldLog(mockWarn);
        expect(notSetResult).toBeTruthy();
      });

      it('Should return true: EnvLevel = 2, LogLevel = 2', () => {
        mockDebug.environment = 'dev';
        const devResult = LoggerLevelsService.shouldLog(mockDebug);
        expect(devResult).toBeTruthy();

        mockDebug.environment = 'test';
        const testResult = LoggerLevelsService.shouldLog(mockDebug);
        expect(testResult).toBeTruthy();

        mockDebug.environment = 'test-auto';
        const testAutoResult = LoggerLevelsService.shouldLog(mockDebug);
        expect(testAutoResult).toBeTruthy();

        mockDebug.environment = 'not-set';
        const notSetResult = LoggerLevelsService.shouldLog(mockDebug);
        expect(notSetResult).toBeTruthy();
      });
    });
  });

  describe('getEnvLevels()', () => {
    it('should return the env log levels', () => {
      const levels = LoggerLevelsService.getEnvLevels();
      expect(levels.prod).toBeDefined();
      expect(levels.preprod).toBeDefined();
      expect(levels.test).toBeDefined();
      expect(levels['test-auto']).toBeDefined();
      expect(levels.dev).toBeDefined();
      expect(levels['not-set']).toBeDefined();
    });
  });

  describe('getLogLevels()', () => {
    it('should return the env levels', () => {
      const levels = LoggerLevelsService.getLogLevels();
      expect(levels.error).toBeDefined();
      expect(levels.warn).toBeDefined();
      expect(levels.info).toBeDefined();
      expect(levels.debug).toBeDefined();
    });
  });
});
