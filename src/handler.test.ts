import * as Inventory from './handler';
import { UpdateInventory } from './services/update-inventory';

// Libs
import { ShopifyProductVariants } from '../libs/shopify';
import { SupplierInventoryService } from '../libs/supplier';
import { Logger } from '../libs/logger';
import { EnvService } from '../libs/utils/env.service';

// Helpers
import * as Helper from '../libs/supplier/services/helpers/inventory-records.helper';

// Interfaces
import { SupplierInventory } from '../libs/supplier/interfaces/inventory';

describe('Handler', () => {
  let productVariantApiSpy: any;
  let updateSpy: any;
  let mockExertis: SupplierInventory[];

  beforeEach(() => {
    spyOn(Logger, 'info');
    spyOn(Logger, 'error');

    spyOn(SupplierInventoryService, 'archiveInventoryFile');
    spyOn(EnvService, 'getParam').and.returnValue(
      JSON.stringify({
        username: 'testUsername',
        password: 'testPassword',
        shop: 'testShop',
        version: 'testVersion',
      })
    );
  });

  describe('good :)', () => {
    beforeEach(() => {
      updateSpy = spyOn(UpdateInventory.prototype, 'update');
      productVariantApiSpy = spyOn(ShopifyProductVariants.prototype, 'get');
      spyOn<any>(UpdateInventory.prototype, 'getLocation');

      mockExertis = Helper.getMockInventoryRecords();
      spyOn(SupplierInventoryService, 'get').and.returnValue(mockExertis);
    });

    it('should call the logger', async () => {
      await Inventory.processStockFeed();

      expect(Logger.info).toHaveBeenCalledWith('Processing Stock Feed');
    });

    it('should get the file for Exertis', async () => {
      await Inventory.processStockFeed();

      expect(SupplierInventoryService.get).toHaveBeenCalled();
    });

    it('should call the update function with the correct params', async () => {
      await Inventory.processStockFeed();

      expect(updateSpy).toHaveBeenCalledWith(mockExertis);
    });

    it('should archive the file', async () => {
      await Inventory.processStockFeed();

      expect(SupplierInventoryService.archiveInventoryFile).toHaveBeenCalled();
    });
  });

  describe('bad :)', () => {
    const randomError = new Error('Random error');

    beforeEach(() => {
      updateSpy = spyOn(UpdateInventory.prototype, 'update').and.callFake(
        () => {
          throw randomError;
        }
      );
      spyOn<any>(UpdateInventory.prototype, 'getLocation');
      mockExertis = Helper.getMockInventoryRecords();
      spyOn(SupplierInventoryService, 'get').and.returnValue(mockExertis);
    });

    it('should catch and log an error when update fails', async () => {
      await Inventory.processStockFeed();

      expect(Logger.error).toHaveBeenCalledWith(randomError);
    });
  });

  describe('no files :(', () => {
    beforeEach(() => {
      updateSpy = spyOn(UpdateInventory.prototype, 'update');
      spyOn(SupplierInventoryService, 'get').and.returnValue(undefined);
    });

    it('should not process update when no data is returned from the server', async () => {
      await Inventory.processStockFeed();

      expect(updateSpy).toHaveBeenCalledTimes(0);
      expect(Logger.info).toHaveBeenCalledWith('No file returned from Exertis');
    });

    it('should not archive the file', async () => {
      await Inventory.processStockFeed();

      expect(
        SupplierInventoryService.archiveInventoryFile
      ).toHaveBeenCalledTimes(0);
    });
  });
});
