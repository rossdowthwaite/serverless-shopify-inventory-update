import * as Handler from '../src/handler';
import { ShopifyProductsApi } from '../libs/shopify';

// Utils
import * as CsvConverter from '../libs/utils/csv-converter';
import { asyncForEach } from '../libs/utils/asyncForEach';

// Interfaces
import { ProductVariant } from '../libs/shopify/interfaces/product-variant';
import {
  ShopifyProducts,
  ShopifyProduct,
} from '../libs/shopify/interfaces/product';

// 3rd
import * as fse from 'fs-extra';

void (async function () {
  // Get the Inventory file...
  const mockInventory = await getMockInventory();

  // run update process
  await Handler.updateProcess(mockInventory);

  // Get the values again post update.
  await checkNewValues();
})();

/**
 * Gets the mock Inventory csv
 * converts it to an Object
 *
 * @returns
 */
async function getMockInventory() {
  const inventoryCsv = fse.readFileSync(`src/mock-supplier/Inventory.csv`, {
    encoding: 'utf8',
  });

  // convert it to object
  return await CsvConverter.csvToObject(inventoryCsv);
}

/**
 * Creates a JSON file of the newly updated inventory
 *
 */
async function checkNewValues() {
  const preUpdateData = JSON.parse(
    fse.readFileSync(`src/mock-supplier/shs-inventory_pre-update.json`, {
      encoding: 'utf8',
    })
  );

  const shopifyProductsApi = new ShopifyProductsApi('project_name');
  const response: ShopifyProducts = await shopifyProductsApi.getAll();

  const { products } = response;

  await asyncForEach(products, async (product: ShopifyProduct) => {
    const variants: ProductVariant[] = product.variants;

    await asyncForEach(variants, async (variant: ProductVariant) => {
      const item = preUpdateData.find(
        (preItem: { id: number; available: number }) =>
          preItem.id === variant.id
      );

      item.new_quantity = variant.inventory_quantity;
    });
  });

  const localShsFilePath = 'src/mock-supplier/shs-inventory_post-update.json';
  await fse.outputFile(localShsFilePath, JSON.stringify(preUpdateData));
  console.log(`post update SHS inventory data written to ${localShsFilePath}`);
}
