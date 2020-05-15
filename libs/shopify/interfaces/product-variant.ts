export interface ProductVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string;
  fulfillment_service: string;
  inventory_management: string;
  option1: string;
  option2: string;
  option3: string;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string;
  grams: number;
  image_id: number;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
  presentment_prices: PresentmentPrices[];
}

export interface ProductVariantResponse {
  variant: ProductVariant;
}

export interface PresentmentPrices {
  price: PresentmentPrices_Price;
  compare_at_price: PresentmentPrices_Price;
}

export interface PresentmentPrices_Price {
  currency_code: string;
  amount: string;
}
