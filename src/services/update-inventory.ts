// Libs
import {
  ShopifyProductVariants,
  ShopifyLocationsApi,
  ShopifyInventoryApi,
} from '../../libs/shopify';
import { Logger } from '../../libs/logger';

// utils
import { asyncForEach } from '../../libs/utils/asyncForEach';

// Interfaces
import {
  ProductVariant,
  ProductVariantResponse,
} from '../../libs/shopify/interfaces/product-variant';
import { ShopifyLocations } from '../../libs/shopify/interfaces/locations';
import {
  ShopifyUpdateInventoryResponse,
  ShopifyInventoryLevel,
} from '../../libs/shopify/interfaces/inventory';
import { ShopifyProject } from '../../libs/shopify/interfaces/shopify';
import { SupplierInventory } from '../../libs/supplier/interfaces/inventory';

export class UpdateInventory {
  private PROJECT: ShopifyProject = 'project_name';

  private shopifyLocationsApi: ShopifyLocationsApi;
  private shopifyInventoryApi: ShopifyInventoryApi;
  private shopifyProductVariants: ShopifyProductVariants;
  private location: number | undefined;

  private updatedAmount: number = 0;
  private failedAmount: number = 0;
  private unprocessedAmount: number = 0;

  constructor() {
    this.shopifyProductVariants = new ShopifyProductVariants(this.PROJECT);
    this.shopifyInventoryApi = new ShopifyInventoryApi(this.PROJECT);
    this.shopifyLocationsApi = new ShopifyLocationsApi(this.PROJECT);
  }

  /**
   * Loops through the Exertis inventory records to update in shopify
   *
   * @param {SupplierInventory[]} mockInventoryRecords
   * @memberof UpdateInventory
   */
  async update(mockInventoryRecords: SupplierInventory[]) {
    await asyncForEach(
      mockInventoryRecords,
      async (record: SupplierInventory) => {
        const {
          Cust_Prod_Number: prodId,
          Available_To_Order: available,
        } = record;
        await this.updateSingle(prodId, +available);
      }
    );

    Logger.info(`
Update complete!
${this.updatedAmount}/${mockInventoryRecords.length} products updated successfully,
${this.unprocessedAmount}/${mockInventoryRecords.length} unprocessable,
${this.failedAmount}/${mockInventoryRecords.length} failed `);
  }

  /**
   * Updates a single product inventory
   *
   * @private
   * @param {string} productId
   * @param {number} available
   * @memberof UpdateInventory
   */
  private async updateSingle(
    productId: string,
    available: number
  ): Promise<void> {
    const parsedProductId = this.parseProductNumber(productId);
    await this.setNewInventory(parsedProductId, available);
  }

  /**
   * Gets the location of the shopify store.
   * NOTE: Depending on how many locations there are, and the likelyhood of it changing,
   * this could be stored as an SSM param instead and save API calls.
   *
   * @private
   * @memberof UpdateInventory
   */
  private async getLocation() {
    if (!this.location) {
      const locationsResponse: ShopifyLocations = await this.shopifyLocationsApi.get();
      this.location = locationsResponse.locations[0].id;
    }
  }

  /**
   * Parses the product number:
   * - Removes "@EDF" suffix
   * - converts to number
   *
   * NOTE: there could be more parsing required - need to enquire and confirm with Exertis.
   *
   * @private
   * @param {string} prodNumber
   * @returns {number}
   * @memberof UpdateInventory
   */
  private parseProductNumber(prodNumber: string): number {
    return +prodNumber.slice(0, -6);
  }

  /**
   * Sets the new inventory amount for an item in shopify
   *
   * @private
   * @param {number} available
   * @param {number} productId
   * @memberof UpdateInventory
   */
  private async setNewInventory(
    productId: number,
    available: number
  ): Promise<void> {
    let inventory_item_id = 0;
    try {
      await this.getLocation();

      const variantResponse: ProductVariantResponse = await this.shopifyProductVariants.get(
        productId
      );
      const variant: ProductVariant = variantResponse.variant;
      inventory_item_id = variant.inventory_item_id;

      const response: ShopifyUpdateInventoryResponse = await this.shopifyInventoryApi.set(
        available,
        inventory_item_id,
        <number>this.location
      );

      if (response.inventory_level) {
        this.updatedAmount++;
        const result: ShopifyInventoryLevel = response.inventory_level;
        Logger.info(
          `Item ${productId} inventory successfully updated to ${result.available}`
        );
      }
    } catch (error) {
      const err = JSON.parse(error.message);
      if (
        err.status === 422 &&
        err.statusText === 'Unprocessable Entity' &&
        err.message[0] ===
          'Inventory item does not have inventory tracking enabled'
      ) {
        this.unprocessedAmount++;
        Logger.warn(
          `Inventory ${inventory_item_id} item does not have inventory tracking enabled`
        );
      } else {
        this.failedAmount++;
        Logger.error(error);
      }
    }
  }
}
