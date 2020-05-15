import { SupplierInventoryService } from './supplier-inventory.service';
import { SupplierService } from './supplier.service';

// Libs
import { EnvService } from '../../utils/env.service';
import { Logger } from '../../logger';
import * as fse from 'fs-extra';

// Helpers
import * as Helpers from './helpers/inventory-records.helper';

// Interfaces
import { SupplierInventory } from '../interfaces/inventory';
import { FileInfo } from '../../../node_modules/@types/ssh2-sftp-client';

describe('SupplierInventoryService', () => {
  beforeEach(() => {
    spyOn(Logger, 'info');
  });

  describe('get', () => {
    let fileContents: any;
    let convertedFileContents: SupplierInventory[];

    beforeEach(() => {
      fileContents = fse.readFileSync(
        `libs/supplier/services/helpers/mockInventory.csv`,
        {
          encoding: 'utf8',
        }
      );
      convertedFileContents = Helpers.mockInventoryArray();
      spyOn(SupplierService, 'connectToSFTP');
      spyOn(SupplierInventoryService, 'getInventoryFile').and.returnValue(
        fileContents
      );
    });

    it('should connect to the SFTP server', async () => {
      await SupplierInventoryService.get();
      expect(SupplierService.connectToSFTP).toHaveBeenCalled();
    });

    it('should get the inventory file', async () => {
      await SupplierInventoryService.get();
      expect(SupplierInventoryService.getInventoryFile).toHaveBeenCalled();
    });

    it('should return data as an object', async () => {
      const result = await SupplierInventoryService.get();
      expect(result).toEqual(convertedFileContents);
    });
  });

  describe('getInventoryFile', () => {
    let sftpSpy: any;

    beforeEach(() => {
      spyOn(EnvService, 'getParam').and.returnValue('SFTP_HOME_DIRECTORY');
      SupplierInventoryService.sftp = { get: () => {} };
      sftpSpy = spyOn(SupplierInventoryService.sftp, 'get');
    });

    describe('given file exists, ', () => {
      beforeEach(() => {
        spyOn(SupplierInventoryService, 'hasFile').and.returnValue(
          Promise.resolve(true)
        );
      });

      it('should check the relevant file exists', async () => {
        await SupplierInventoryService.getInventoryFile();

        expect(SupplierInventoryService.hasFile).toHaveBeenCalled();
      });

      it('should get the file contents if file exists', async () => {
        await SupplierInventoryService.getInventoryFile();

        expect(sftpSpy).toHaveBeenCalled();
      });
    });

    describe('given file does not exist, ', () => {
      beforeEach(() => {
        spyOn(SupplierInventoryService, 'hasFile').and.returnValue(
          Promise.resolve(false)
        );
      });

      it('should log that is does not exist', async () => {
        await SupplierInventoryService.getInventoryFile();

        expect(Logger.info).toHaveBeenCalledWith('No Inventory.csv file found');
      });
    });
  });

  describe('hasFile', () => {
    let sftpSpy: any;

    beforeEach(() => {
      spyOn(EnvService, 'getParam').and.returnValue('SFTP_HOME_DIRECTORY');
      SupplierInventoryService.sftp = { list: () => {} };
      sftpSpy = spyOn(SupplierInventoryService.sftp, 'list').and.returnValue(<
        FileInfo[]
      >[{}, {}]);
    });

    describe('when file exists, ', () => {
      beforeEach(() => {
        spyOn(SupplierInventoryService, 'filterFile').and.returnValue([{}]);
      });

      it('should list the files on the SFTP server', async () => {
        await SupplierInventoryService.hasFile();

        expect(sftpSpy).toHaveBeenCalledWith('SFTP_HOME_DIRECTORY/out/');
      });

      it('should filter the file list', async () => {
        await SupplierInventoryService.hasFile();

        expect(SupplierInventoryService.filterFile).toHaveBeenCalledWith([
          {},
          {},
        ]);
      });

      it('should return true when found', async () => {
        const result = await SupplierInventoryService.hasFile();

        expect(result).toEqual(true);
      });
    });

    describe('when does not file exists, ', () => {
      beforeEach(() => {
        spyOn(SupplierInventoryService, 'filterFile').and.returnValue([]);
      });

      it('should return false when not found', async () => {
        const result = await SupplierInventoryService.hasFile();

        expect(result).toEqual(false);
      });
    });
  });

  describe('filterFile', () => {
    it('should filter the files to return only what we want', async () => {
      const result = await SupplierInventoryService.filterFile(<FileInfo[]>[
        {
          name: 'nope',
        },
        { name: 'Inventory.csv' },
      ]);

      expect(result).toEqual([{ name: 'Inventory.csv' }]);
    });
  });

  describe('archiveInventoryFile', () => {
    it('should rename the file with a timestamp', async () => {
      SupplierInventoryService.homeDirectory = 'home-directory';
      SupplierInventoryService.INVENTORY_FILENAME = 'filename.csv';
      SupplierInventoryService.processDate = '20200513031707';
      SupplierInventoryService.sftp = {
        rename: (argOne: string, argTwo: string) => {},
      };
      let sftpSpy = spyOn(SupplierInventoryService.sftp, 'rename');

      await SupplierInventoryService.archiveInventoryFile();

      expect(sftpSpy).toHaveBeenCalledWith(
        'home-directory/out/filename.csv',
        'home-directory/out/Archive/Inventory_20200513031707.csv'
      );
    });
  });
});
