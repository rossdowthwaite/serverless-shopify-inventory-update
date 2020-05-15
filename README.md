# Inventory Stock take : AWS Lambda Microservice

## Introduction

A lambda microservice that updates the inventory of a Shopify store with stock numbers from a supplier.

- The supplier holds inventory data in a `.csv` file on an their hosted SFTP client.
- The inventory file is updated hourly on the server.

## Technologies

- [AWS](https://aws.amazon.com/)
- [AWS-SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html)
- [Typescript](https://www.typescriptlang.org/docs/home.html)
- [Serverless](https://www.serverless.com/framework/docs/)
- [Shopify API](https://shopify.dev/docs/admin-api/rest/reference)
- [Shopify Inventory API](https://shopify.dev/docs/admin-api/rest/reference/inventory)
- [Jest](https://jestjs.io/en/)

## Usage

- The lambda is scheduled to run every hour.

### The process

The process is as follows:

**Get** the inventory file from Supplier' SFTP server:

- Connect to Suppliers SFTP server
- Get the `Inventory.csv` - one row for each inventory record.

**Process** rows/inventory records, and update the inventory in the Smarthome Store:

- Retrieve the `variant` from Shopify that matches the `Product_Number` from the inventory record.
- Extract the `id` from the `variant`.
- Update the stock item (`id` match) using the `inventory_levels` endpoint.
- Use the `Available_To_Order` value from the `csv` as the new inventory value.

**Archive** the Supplier file in an archive folder on the server.

- Rename the file in SFTP server include a timestamp. e.g. `Inventory.csv`
- Delete the old file.

## Development

TDB

### Supplier SFTP server

TBD

## Deployment

To deploy the lambda to the **dev** environment:

```bash
npm run deploy:dev
```

To deploy the lambda to the **prod** environment:

```bash
npm run deploy:prod
```

## Testing

### Unit tests

Tests are written and run using [Jest](https://jestjs.io/en/).

```bash
npm run test
```

## Contributors

- Ross Dowthwaite
