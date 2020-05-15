import { ShopifyInventoryApi } from './shopify-inventory';
import { ShopifyApi } from './shopify-api-class.service';
import { EnvService } from '../../utils/env.service';

describe('ShopifyInventoryApi', () => {
  let shopifyInventory: ShopifyInventoryApi;

  beforeEach(() => {
    spyOn(EnvService, 'getParam').and.returnValue(
      JSON.stringify({
        username: 'testUsername',
        password: 'testPassword',
        shop: 'testShop',
        version: 'testVersion',
      })
    );
    spyOn(ShopifyApi.prototype, 'get');
    spyOn(ShopifyApi.prototype, 'post');

    shopifyInventory = new ShopifyInventoryApi('project_name');
  });

  describe('getAll', () => {
    it('Should call shopify API with the correct params', async () => {
      const item_ids = [1234, 4567, 7890];
      const location_ids = [4321, 76543, 98756];

      await shopifyInventory.getAll(item_ids, location_ids);

      expect(ShopifyApi.prototype.get).toHaveBeenCalledWith(
        '/inventory_levels.json?inventory_item_ids=1234,4567,7890&location_ids=4321,76543,98756'
      );
    });
  });

  describe('set', () => {
    it('Should call shopify API with the correct params', async () => {
      const available = 12;
      const item_id = 123456;
      const location_id = 1234342;

      await shopifyInventory.set(available, item_id, location_id);

      expect(ShopifyApi.prototype.post).toHaveBeenCalledWith(
        '/inventory_levels/set.json',
        {
          location_id: 1234342,
          inventory_item_id: 123456,
          available: 12,
        }
      );
    });
  });
});
