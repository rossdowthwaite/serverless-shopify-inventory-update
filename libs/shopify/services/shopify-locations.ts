import { ShopifyApi } from './shopify-api-class.service';

// Interfaces
import { ShopifyProject } from '../interfaces/shopify';
import { ShopifyLocations } from '../interfaces/locations';

export class ShopifyLocationsApi {
  private shopifyApi: ShopifyApi;

  constructor(project: ShopifyProject) {
    this.shopifyApi = new ShopifyApi(project);
  }

  /**
   * Gets the shopify locations
   *
   * @returns {Promise<ShopifyLocations>}
   * @memberof ShopifyLocationsApi
   */
  async get(): Promise<ShopifyLocations> {
    const resource = '/locations.json';
    return await this.shopifyApi.get(resource);
  }
}
