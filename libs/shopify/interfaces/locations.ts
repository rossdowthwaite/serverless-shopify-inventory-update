export interface ShopifyLocations {
  locations: ShopifyLocation[];
}

export interface ShopifyLocation {
  id: number;
  name: string;
  address1: string;
  address2: null;
  city: string;
  zip: string;
  province: string;
  country: string;
  phone: null;
  created_at: string;
  updated_at: string;
  country_code: string;
  country_name: string;
  province_code: string;
  legacy: boolean;
  active: boolean;
  admin_graphql_api_id: string;
  localized_country_name: string;
  localized_province_name: string;
}
