import { UpdateInventory } from './update-inventory';
import { Logger } from '../../libs/logger';
import { EnvService } from '../../libs/utils/env.service';

// Helpers
import * as Helper from '../../libs/supplier/services/helpers/inventory-records.helper';

// Interfaces

import { SupplierInventory } from '../../libs/supplier/interfaces/inventory';
import { ShopifyLocations } from '../../libs/shopify/interfaces/locations';
import { ProductVariantResponse } from '../../libs/shopify/interfaces/product-variant';

describe('UpdateInventory', () => {
  let updateInventory: UpdateInventory;

  beforeEach(() => {
    updateInventory = new UpdateInventory();
    spyOn(Logger, 'info');
    spyOn(EnvService, 'getParam');
  });

  describe('update()', () => {
    let updateSingleSpy: any;
    let mockExertis: SupplierInventory[];

    beforeEach(() => {
      updateSingleSpy = spyOn<any>(UpdateInventory.prototype, 'updateSingle');
      mockExertis = Helper.getMockInventoryRecords();
    });

    it('should call updateSingle with the correct amount of times', async () => {
      await updateInventory.update(mockExertis);

      expect(updateSingleSpy).toHaveBeenCalledTimes(5);
    });

    it('should call updateSingle with the correct params', async () => {
      await updateInventory.update(mockExertis);

      expect(updateSingleSpy.calls.all()[0].args).toEqual([
        '10258456@Store',
        123,
      ]);
      expect(updateSingleSpy.calls.all()[1].args).toEqual([
        '10245837@Store',
        50,
      ]);
      expect(updateSingleSpy.calls.all()[2].args).toEqual([
        '10278937@Store',
        74,
      ]);
      expect(updateSingleSpy.calls.all()[3].args).toEqual([
        '10123837@Store',
        23,
      ]);
      expect(updateSingleSpy.calls.all()[4].args).toEqual([
        '10276837@Store',
        10506,
      ]);
    });
  });

  describe('updateSingle()', () => {
    let parseProductNumberSpy: any;
    let setNewInventorySpy: any;
    let product_id: string;
    let parsed_product_id: number;
    let available: number;

    beforeEach(async () => {
      product_id = '10245837@Store';
      parsed_product_id = 10245837;
      available = 1234;

      parseProductNumberSpy = spyOn<any>(
        UpdateInventory.prototype,
        'parseProductNumber'
      ).and.returnValue(parsed_product_id);

      setNewInventorySpy = spyOn<any>(
        UpdateInventory.prototype,
        'setNewInventory'
      ).and.returnValue(Promise.resolve());
    });

    it('should parse the product_id', async () => {
      await (<any>updateInventory).updateSingle(product_id, available);

      expect(parseProductNumberSpy).toHaveBeenCalledWith(product_id);
    });

    it('should set the new inventory amount', async () => {
      await (<any>updateInventory).updateSingle(product_id, available);

      expect(setNewInventorySpy).toHaveBeenCalledWith(
        parsed_product_id,
        available
      );
    });
  });

  describe('getLocation()', () => {
    let shopifyLocationsApiSpy: any;

    beforeEach(() => {
      let shopifyLocationsApi = (<any>updateInventory).shopifyLocationsApi;
      shopifyLocationsApiSpy = spyOn<any>(
        shopifyLocationsApi,
        'get'
      ).and.returnValue(<ShopifyLocations>{
        locations: [{ id: 1234 }],
      });
    });

    it('should get the locations', async () => {
      await (<any>updateInventory).getLocation();

      expect(shopifyLocationsApiSpy).toHaveBeenCalledTimes(1);
    });

    it('should set the location', async () => {
      await (<any>updateInventory).getLocation();
      const location = (<any>updateInventory).location;
      expect(location).toEqual(1234);
    });

    it('should not reset the location', async () => {
      (<any>updateInventory).location = 3456789;
      await (<any>updateInventory).getLocation();
      const location = (<any>updateInventory).location;

      expect(location).toEqual(3456789);
      expect(shopifyLocationsApiSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('parseProductNumber()', () => {
    it('should convert the string to a number', async () => {
      const result = await (<any>updateInventory).parseProductNumber(
        '10258456@Store'
      );

      expect(typeof result).toEqual('number');
    });

    it('should cut off the suffix', async () => {
      const result = await (<any>updateInventory).parseProductNumber(
        '10258456@Store'
      );

      expect(result).toEqual(10258456);
    });
  });

  describe('setNewInventory()', () => {
    const product_id = 123123432;
    const inventory_item_id = 123123432;
    const available = 120;
    const location = 789;
    const inventoryLevel = {
      inventory_level: {
        inventory_item_id,
        location_id: location,
        available,
        updated_at: 5,
        admin_graphql_api_id: 5,
      },
    };

    let shopifyProductVariantsSpy: any;
    let shopifyInventoryApiSpy: any;
    let getLocationSpy: any;

    beforeEach(() => {
      let shopifyProductVariants = (<any>updateInventory)
        .shopifyProductVariants;
      let shopifyInventoryApi = (<any>updateInventory).shopifyInventoryApi;

      getLocationSpy = spyOn<any>(UpdateInventory.prototype, 'getLocation');
      shopifyProductVariantsSpy = spyOn<any>(
        shopifyProductVariants,
        'get'
      ).and.returnValue(<ProductVariantResponse>{
        variant: { inventory_item_id },
      });
      shopifyInventoryApiSpy = spyOn<any>(
        shopifyInventoryApi,
        'set'
      ).and.returnValue(inventoryLevel);
    });

    it('should call getLocations', async () => {
      await (<any>updateInventory).setNewInventory(product_id, available);

      expect(getLocationSpy).toHaveBeenCalledTimes(1);
    });

    it('should call shopifyProductVariants.get with the correct params', async () => {
      await (<any>updateInventory).setNewInventory(product_id, available);

      expect(shopifyProductVariantsSpy).toHaveBeenCalledWith(product_id);
    });

    it('should call shopifyInventoryApi.set with the correct params', async () => {
      (<any>updateInventory).location = location;

      await (<any>updateInventory).setNewInventory(product_id, available);

      expect(shopifyInventoryApiSpy).toHaveBeenCalledWith(
        available,
        product_id,
        location
      );
    });

    it('should log when successful', async () => {
      await (<any>updateInventory).setNewInventory(product_id, available);

      expect(Logger.info).toHaveBeenCalledWith(
        `Item 123123432 inventory successfully updated to 120`
      );
    });
  });
});
