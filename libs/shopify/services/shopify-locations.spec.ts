import { ShopifyLocationsApi } from './shopify-locations';
import { ShopifyApi } from './shopify-api-class.service';
import { EnvService } from '../../utils/env.service';

describe('ShopifyLocationsApi', () => {
  let shopifyLocations: ShopifyLocationsApi;

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

    shopifyLocations = new ShopifyLocationsApi('project_name');
  });

  describe('get', () => {
    it('Should call shopify API with the correct params', async () => {
      await shopifyLocations.get();
      expect(ShopifyApi.prototype.get).toHaveBeenCalledWith('/locations.json');
    });
  });
});
