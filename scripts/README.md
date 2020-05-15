# Manually Testing Inventory Update

- Creates a mock `Inventory.csv` file - `create-mock-inventory-file.ts` script
- Runs an inventory update on the SHS and validates the result - `test-shs-inventory-file.ts` script

To run use:

```
npm run test-update
```

This will run both scripts sequentially.

The resulting data files are saved to `/src/mock-update` directory.

**IMPORTANT: Only to be run in `dev` and `test` environments as will actively update the inventory in SHS.**

## test-shs-inventory-file.ts

Runs an inventory update on the Shopify test Store, and logs the result to a JSON file

### Process

- imports the mock `Inventory.csv` file.
- runs the update inventory process - same exported function as used in the handler.
- gets the new inventory Quantities from the SHS.
- save the results to a `.json` file - `shs-inventory_post-update.json`

## create-mock-inventory-file.ts

Creates a mock inventory file (`Inventory.csv`) using the variant ID's that exist in the SHS.
Used for testing shopify's `inventory_levels` API in a staging/dev environment.

The `Inventory.csv` file contains the current prices and availability of products with the supplier.

### Process

- get the products from the SHS
- loop over the `products` to get `variants`.
- loop over the `variants` to get the `id` and `inventory_quantity` .
- create an inventory record object for each variant.
- convert to `.csv`
- save the file locally to `src/mock-supplier/Inventory.csv`.

### Usage

create a `.env` file and add the following:

```bash
SHOPIFY_PRIVATE_APP_GOODWILL= "#{ Copy value from AWS SSM and paste here }#"
```

Run the script

```bash
npm run mock-supplier-inventory
```

example response:

```bash
=> 30 products retrieved
=> 36 records added
=> Converted to CSV
=> Mock supplier file written to src/mock-supplier/Inventory.csv
```
