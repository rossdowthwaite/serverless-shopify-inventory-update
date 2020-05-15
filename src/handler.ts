import { UpdateInventory } from './services/update-inventory';

// libs
import { SupplierInventoryService } from '../libs/supplier';
import { Logger } from '../libs/logger';

// Interface
import { SupplierInventory } from '../libs/supplier/interfaces/inventory';

/**
 * Handler for hourly process to update the SHS inventory
 *
 * - Gets the inventory file from Exertis' SFTP server.
 * - Processes the file, and updates the inventory in the SHS.
 * - Archives the Exertis file.
 *
 * @export
 */
export async function processStockFeed() {
  Logger.info('Processing Stock Feed');

  try {
    Logger.info('Getting Exertis records...');
    const inventoryRecords = await SupplierInventoryService.get();

    if (inventoryRecords) {
      Logger.info('Updating inventory in Shopify...');
      await updateProcess(inventoryRecords);
      await SupplierInventoryService.archiveInventoryFile();
    } else {
      Logger.info('No file returned from Exertis');
    }
  } catch (error) {
    Logger.error(error);
  }
}

/**
 * Updates the inventory.
 *
 * @export
 * @param {ExertisInventory[]} mockInventoryRecords
 */
export async function updateProcess(mockInventoryRecords: SupplierInventory[]) {
  const updateInventory = new UpdateInventory();
  await updateInventory.update(mockInventoryRecords);
}
