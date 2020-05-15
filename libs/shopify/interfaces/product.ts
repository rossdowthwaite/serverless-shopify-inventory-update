export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string | null;
  published_scope: string;
  tags: string;
  admin_graphql_api_id: string;
  variants: any[];
  options: any[];
  images: any[];
  image: any;
}

export interface ShopifyProducts {
  products: ShopifyProduct[];
}
