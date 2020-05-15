import { SupplierService } from './supplier.service';

// Libs
import { EnvService } from '../../utils/env.service';
import * as CsvConverter from '../../utils/csv-converter';
import { Logger } from '../../logger';

// Interfaces
import { SupplierInventory } from '../interfaces/inventory';

// 3rd
import { FileInfo } from 'ssh2-sftp-client';
import moment from 'moment';

export abstract class SupplierInventoryService {
  static sftp: any;
  static INVENTORY_FILENAME = 'Inventory.csv';
  static homeDirectory: string;
  static processDate: string;

  /**
   * Connect to Supplier' SFTP server
   * Get the Inventory.csv file
   *
   * @static
   * @returns
   * @memberof SupplierInventoryService
   */
  static async get(): Promise<SupplierInventory[] | undefined> {
    this.processDate = this.setDate();
    this.sftp = await SupplierService.connectToSFTP();
    const fileContents = await this.getInventoryFile();
    Logger.info('Inventory file retrieved.');
    if (fileContents) {
      return <SupplierInventory[]>(
        await CsvConverter.csvToObject(String(fileContents))
      );
    }
  }

  /**
   * Get the Inventory.csv
   *
   * @static
   * @returns
   * @memberof SupplierInventoryService
   */
  static async getInventoryFile() {
    this.homeDirectory = EnvService.getParam('SFTP_HOME_DIRECTORY');
    if (await this.hasFile()) {
      const remoteFilePath = `${this.homeDirectory}/out/${this.INVENTORY_FILENAME}`;
      Logger.info('Getting Inventory file...');
      return await this.sftp.get(remoteFilePath);
    } else {
      Logger.info('No Inventory.csv file found');
    }
  }

  /**
   * Check whether the Inventory.csv file exists on the SFTP server
   *
   * @static
   * @returns {Promise<boolean>}
   * @memberof SupplierInventoryService
   */
  static async hasFile(): Promise<boolean> {
    const homeDirectory: string = EnvService.getParam('SFTP_HOME_DIRECTORY');
    Logger.info('Listing files...');
    const files: FileInfo[] = await this.sftp.list(`${homeDirectory}/out/`);
    return this.filterFile(files)[0] !== undefined;
  }

  /**
   * Filter the retrieved files from the SFTP server to find the Inventory.csv
   *
   * @private
   * @static
   * @param {FileInfo[]} files
   * @returns {FileInfo[]}
   * @memberof SupplierInventoryService
   */
  static filterFile(files: FileInfo[]): FileInfo[] {
    Logger.info('Filtering files...');
    return files.filter((file: FileInfo) => {
      // Filename pattern: Inventory.csv"
      return /^Inventory.csv$/i.test(file.name);
    });
  }

  /**
   * Sets the date and time for when the lambda ran
   * - sets to the string format used for archiving the file
   * - Theres a bug in moment where 'hhmmss' = 000000 when preceded by 'yyyyMMDD'
   * - so had to concat the two
   * @static
   * @returns
   * @memberof SupplierInventoryService
   */
  static setDate() {
    return `${moment().format('yyyyMMDD') + moment().format('hhmmss')}`;
  }

  /**
   * Archives the processed inventory file
   * - adds timestamp
   * @static
   * @memberof SupplierInventoryService
   */
  static async archiveInventoryFile() {
    const archivedName = `Inventory_${this.processDate}.csv`;
    this.sftp.rename(
      `${this.homeDirectory}/out/${this.INVENTORY_FILENAME}`,
      `${this.homeDirectory}/out/Archive/${archivedName}`
    );
  }

  /**
   * deletes the processed inventory file
   * - adds timestamp
   * @static
   * @memberof SupplierInventoryService
   */
  static async deleteInventoryFile() {}
}
