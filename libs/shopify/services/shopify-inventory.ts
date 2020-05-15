import { ShopifyApi } from './shopify-api-class.service';

// Interfaces
import { ShopifyProject } from '../interfaces/shopify';
import {
  ShopifyUpdateInventoryReqBody,
  ShopifyUpdateInventoryResponse,
  ShopifyInventoryLevels,
} from '../interfaces/inventory';

export class ShopifyInventoryApi {
  private shopifyApi: ShopifyApi;

  constructor(project: ShopifyProject) {
    this.shopifyApi = new ShopifyApi(project);
  }

  /**
   * Gets the inventory available for a set of products
   *
   * @param {number[]} item_ids
   * @param {number[]} location_ids
   * @returns {Promise<ShopifyInventoryLevels>}
   * @memberof ShopifyInventory
   */
  async getAll(
    item_ids: number[],
    location_ids: number[]
  ): Promise<ShopifyInventoryLevels> {
    const resource = `/inventory_levels.json?inventory_item_ids=${item_ids.join(
      ','
    )}&location_ids=${location_ids.join(',')}`;
    return await this.shopifyApi.get(resource);
  }

  /**
   * Gets the inventory available for a set of products
   *
   * @param {number[]} item_ids
   * @param {number[]} location_ids
   * @returns {Promise<ShopifyInventoryLevels>}
   * @memberof ShopifyInventory
   */
  async getInventory(item_ids: number[]): Promise<ShopifyInventoryLevels> {
    const resource = `/inventory_levels.json?inventory_item_ids=${item_ids.join(
      ','
    )}`;

    return await this.shopifyApi.get(resource);
  }

  /**
   * Sets the inventory for a particular product
   *
   * @param {number} available
   * @param {number} itemId
   * @param {number} locationId
   * @returns {Promise<any>}
   * @memberof ShopifyInventory
   */
  async set(
    available: number,
    itemId: number,
    locationId: number
  ): Promise<ShopifyUpdateInventoryResponse> {
    const resource = '/inventory_levels/set.json';

    const data: ShopifyUpdateInventoryReqBody = {
      location_id: locationId,
      inventory_item_id: itemId,
      available: +available,
    };

    return await this.shopifyApi.post(resource, data);
  }
}
