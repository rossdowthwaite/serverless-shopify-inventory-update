import { EnvService } from './env.service';
import { Logger } from '../logger';
import dotenv from 'dotenv';

describe('EnvService', () => {
  describe('getParam()', () => {
    beforeEach(() => {
      process.env = { A_REAL_VALUE: 'someabc' };
      spyOn(Logger, 'warn');
    });

    it('should return a value', () => {
      const value = EnvService.getParam('A_REAL_VALUE');
      expect(value).toEqual('someabc');
    });

    it('should throw an error', () => {
      expect(function () {
        EnvService.getParam('A_DUFF_VALUE');
      }).toThrowError('Value of A_DUFF_VALUE does not exist');
    });

    it('should log a warning when no param found and param to equal not-set', () => {
      const param = EnvService.getParam('A_DUFF_VALUE', true);
      expect(param).toEqual('not-set');
    });

    it('should not call dotenv.config if local development', () => {
      process.env.AWS_EXECUTION_ENV = 'this';

      spyOn(dotenv, 'config');

      EnvService.getParam('A_DUFF_VALUE', true);
      expect(dotenv.config).toHaveBeenCalledTimes(0);
    });
  });

  // TODO: setParam
});
