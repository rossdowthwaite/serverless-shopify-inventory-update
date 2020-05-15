import { ShopifyProductVariants } from './shopify-products-variants';
import { ShopifyApi } from './shopify-api-class.service';
import { EnvService } from '../../utils/env.service';

describe('ShopifyProductVariants', () => {
  let shopifyProductVariants: any;

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
    spyOn(ShopifyApi.prototype, 'delete');
    spyOn(ShopifyApi.prototype, 'post');
    spyOn(ShopifyApi.prototype, 'put');

    shopifyProductVariants = new ShopifyProductVariants('project_name');
  });

  describe('get', () => {
    it('Should call shopify API with the correct params', async () => {
      const productId = 1234567;
      await shopifyProductVariants.get(productId);

      expect(ShopifyApi.prototype.get).toHaveBeenCalledWith(
        '/variants/1234567.json'
      );
    });
  });

  describe('getAll', () => {
    it('Should call shopify API with the correct params', async () => {
      const productId = 1234567;
      await shopifyProductVariants.getAll(productId);

      expect(ShopifyApi.prototype.get).toHaveBeenCalledWith(
        '/1234567/variants.json'
      );
    });
  });
});
