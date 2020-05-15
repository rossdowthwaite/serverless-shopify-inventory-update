import { LoggerDataService } from './logger-data.service';
import { EnvService } from '../../utils/env.service';

describe('LoggerDataService', () => {
  describe('getMetadata', () => {
    it('Should return the metadata', () => {
      spyOn(EnvService, 'getParam').and.callFake((arg: string) => {
        switch (arg) {
          case 'ENVIRONMENT':
            return 'prod';
          case 'PROJECT':
            return 'PROJECT';
          default:
            return '';
        }
      });

      const metadata = LoggerDataService.getMetadata();
      expect(metadata.environment).toEqual('prod');
      expect(metadata.project).toEqual('PROJECT');
    });

    it('Should return environment as not set', () => {
      spyOn(EnvService, 'getParam').and.callFake((arg: string) => {
        switch (arg) {
          case 'ENVIRONMENT':
            throw new Error('ENVIRONMENT value not found');
          case 'PROJECT':
            return 'PROJECT';
          default:
            return '';
        }
      });

      const metadata = LoggerDataService.getMetadata();
      expect(metadata.environment).toEqual('not-set');
      expect(metadata.project).toEqual('PROJECT');
    });

    it('Should return both as not set', () => {
      spyOn(EnvService, 'getParam').and.callFake((arg: string) => {
        switch (arg) {
          case 'ENVIRONMENT':
            throw new Error('ENVIRONMENT value not found');
          case 'PROJECT':
            throw new Error('PROJECT value not found');
          default:
            return '';
        }
      });

      const metadata = LoggerDataService.getMetadata();
      expect(metadata.environment).toEqual('not-set');
      expect(metadata.project).toEqual('not-set');
    });
  });
});
