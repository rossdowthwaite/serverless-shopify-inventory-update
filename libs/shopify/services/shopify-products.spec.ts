import { ShopifyApi } from './shopify-api-class.service';
import { ShopifyProductsApi } from './shopify-products';
import { EnvService } from '../../utils/env.service';

describe('ShopifyProducts', () => {
  let shopifyProducts: any;

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
    shopifyProducts = new ShopifyProductsApi('project_name');
  });

  describe('getAll', () => {
    it('Should call shopify API with the correct params', async () => {
      await shopifyProducts.getAll();
      expect(ShopifyApi.prototype.get).toHaveBeenCalledWith('/products.json');
    });
  });

  describe('get', () => {
    it('Should call shopify API with the correct params', async () => {
      await shopifyProducts.get(1234);
      expect(ShopifyApi.prototype.get).toHaveBeenCalledWith(
        `/products/1234.json`
      );
    });
  });

  describe('count', () => {
    it('Should call shopify API with the correct params', async () => {
      await shopifyProducts.count(1234);
      expect(ShopifyApi.prototype.get).toHaveBeenCalledWith(
        '/products/count.json'
      );
    });
  });
});
