export type ShopifyProject = 'project_name';

export interface ShopifyKeys {
  [key: string]: {
    username: string;
    password: string;
    shop: string;
    version: string;
    location_id?: number;
  };
}
