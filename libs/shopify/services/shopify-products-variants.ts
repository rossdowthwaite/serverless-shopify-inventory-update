import { ShopifyApi } from './shopify-api-class.service';

// Interfaces
import { ShopifyProject } from '../interfaces/shopify';
import {
  ProductVariant,
  ProductVariantResponse,
} from '../interfaces/product-variant';

export class ShopifyProductVariants {
  private shopifyApi: ShopifyApi;

  constructor(project: ShopifyProject) {
    // TODO: update this with inventory private app once made
    this.shopifyApi = new ShopifyApi(project);
  }

  /**
   * Get a product variant
   *
   * @param {number} id
   * @returns {Promise<ProductVariant>}
   * @memberof ShopifyPricerule
   */
  async get(id: number): Promise<ProductVariantResponse> {
    const resource = `/variants/${id}.json`;
    return await this.shopifyApi.get(resource);
  }

  /**
   * Get all variants for a product
   *
   * @param {number} productId
   * @returns {Promise<ProductVariant[]>}
   * @memberof ShopifyPricerule
   */
  async getAll(productId: number): Promise<ProductVariant[]> {
    const resource = `/${productId}/variants.json`;
    return await this.shopifyApi.get(resource);
  }
}
