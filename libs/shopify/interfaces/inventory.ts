export interface ShopifyUpdateInventoryReqBody {
  location_id: number;
  inventory_item_id: number;
  available: number;
}

export interface ShopifyUpdateInventoryResponse {
  inventory_level: ShopifyInventoryLevel;
}

export interface ShopifyInventoryLevel {
  inventory_item_id: number;
  location_id: number;
  available: number;
  updated_at: number;
  admin_graphql_api_id: number;
}

export interface ShopifyInventoryLevels {
  inventory_levels: ShopifyInventoryLevel;
}
