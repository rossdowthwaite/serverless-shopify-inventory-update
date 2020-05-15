import { ShopifyProductsApi } from '../libs/shopify';

// Utils
import { asyncForEach } from '../libs/utils/asyncForEach';
import { objectToCsv } from '../libs/utils/csv-converter';
import * as fse from 'fs-extra';

// Interfaces
import {
  ShopifyProduct,
  ShopifyProducts,
} from '../libs/shopify/interfaces/product';
import { ProductVariant } from '../libs/shopify/interfaces/product-variant';
import { SupplierInventory } from '../libs/supplier/interfaces/inventory';

void (async function () {
  const mockSupplierInventoryObjects: SupplierInventory[] = [];
  const mockShsInventoryObjects: { id: number; old_quantity: number }[] = [];

  try {
    const shopifyProductsApi = new ShopifyProductsApi('project_name');
    const response: ShopifyProducts = await shopifyProductsApi.getAll();
    const { products } = response;

    console.log(`${products.length} products retrieved`);

    await asyncForEach(products, async (product: ShopifyProduct) => {
      const variants: ProductVariant[] = product.variants;

      await asyncForEach(variants, async (variant: ProductVariant) => {
        mockShsInventoryObjects.push(addShsMockEntry(variant));
        mockSupplierInventoryObjects.push(addMockSupplierEntry(variant));
      });
    });

    console.log(`${mockSupplierInventoryObjects.length} records added`);

    // Convert Supplier data to .csv
    const mockSupplierInventoryCsv = await objectToCsv(
      mockSupplierInventoryObjects
    );
    console.log('Converted to CSV');

    const localSupplierFilePath = 'src/mock-supplier/Supplier_UK.csv';
    const localShsFilePath = 'src/mock-supplier/shs-inventory_pre-update.json';

    await fse.outputFile(localSupplierFilePath, mockSupplierInventoryCsv);
    console.log(`Mock Supplier file written to ${localSupplierFilePath}`);

    await fse.outputFile(
      localShsFilePath,
      JSON.stringify(mockShsInventoryObjects)
    );
    console.log(`pre update SHS inventory data written to ${localShsFilePath}`);
  } catch (error) {
    console.log(error);
  }
})();

/**
 * Creates a mock entry for the mock Supplier_UK.csv

 *
 * @param {ProductVariant} variant
 * @returns {SupplierInventory}
 */
function addMockSupplierEntry(variant: ProductVariant): SupplierInventory {
  const { id, inventory_quantity } = variant;
  const diff = 5; // update quantity

  return {
    Cust_Prod_Number: `${id}`,
    Available_To_Order: `${inventory_quantity + diff}`,
  };
}

/**
 * Creates a mock entry for the mock Supplier_UK.csv
 *
 * @param {ProductVariant} variant
 * @returns {SupplierInventory}
 */
function addShsMockEntry(
  variant: ProductVariant
): { id: number; old_quantity: number } {
  const { id, inventory_quantity: old_quantity } = variant;
  return {
    id,
    old_quantity,
  };
}
