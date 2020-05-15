import { EnvService } from '../../utils/env.service';
import { SupplierService } from './supplier.service';
import * as ServiceHelper from './helpers/supplier.service.spec.helper';

describe('SupplierService', () => {
  beforeAll(() => {
    spyOn(EnvService, 'getParam').and.callFake(
      (label: string, silentFail: boolean) => {
        switch (label) {
          case 'SFTP_HOME_DIRECTORY':
            return '';
          case 'SFTP_MODE':
            return 'password';
          case 'SFTP_PORT':
            return '22';
          default:
            return label;
        }
      }
    );
  });

  /* SFTP */
  describe('getSFTPClient', () => {
    it('should return an SftpClient instance', async () => {
      const client = SupplierService.getSFTPClient();
      expect(client.constructor.name).toBe('SftpClient');
    });
  });

  describe('connectToSFTP', () => {
    it('should connect to SFTP', async () => {
      const mockSftpClient = ServiceHelper.getMockSftpClient();
      spyOn(mockSftpClient, 'connect');
      spyOn(SupplierService, 'getSFTPClient').and.returnValue(mockSftpClient);

      await SupplierService.connectToSFTP();

      expect(SupplierService.getSFTPClient).toHaveBeenCalled();
      expect(mockSftpClient.connect).toHaveBeenCalledWith({
        host: 'SFTP_HOST',
        port: 22,
        username: 'SFTP_USERNAME',
        password: 'SFTP_PASSWORD_OR_KEY',
      });
    });
  });
});
