import { ShopifyApi } from './shopify-api-class.service';

// Interfaces
import { ShopifyProject } from '../interfaces/shopify';
import { ShopifyProduct, ShopifyProducts } from '../interfaces/product';

export class ShopifyProductsApi {
  private shopifyApi: ShopifyApi;

  constructor(project: ShopifyProject) {
    this.shopifyApi = new ShopifyApi(project);
  }

  /**
   * get all products
   *
   * @returns {Promise<ShopifyProducts>}
   * @memberof ShopifyProductsApi
   */
  async getAll(): Promise<ShopifyProducts> {
    const resource = '/products.json';
    return await this.shopifyApi.get(resource);
  }

  /**
   * get a single product
   *
   * @returns {Promise<ShopifyProduct>}
   * @memberof ShopifyProductsApi
   */
  async get(productId: number): Promise<ShopifyProduct> {
    const resource = `/products/${productId}.json`;
    return await this.shopifyApi.get(resource);
  }

  /**
   * get product count
   *
   * @returns {Promise<ShopifyProduct>}
   * @memberof ShopifyProductsApi
   */
  async count(): Promise<{ count: number }> {
    const resource = `/products/count.json`;
    return await this.shopifyApi.get(resource);
  }
}
