export type User = {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'vendor' | 'admin' | 'super_admin' | 'support';
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku: string;
  stock_quantity: number;
  category_id: string;
  category_name?: string;
  vendor_id?: string;
  vendor_name?: string;
  images: string[];
  tags: string[];
  rating: number;
  review_count: number;
  is_active: boolean;
  is_featured: boolean;
  is_digital: boolean;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  options: Record<string, string>;
  price?: number;
  stock_quantity: number;
  sku?: string;
  image?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: string;
  product_count?: number;
  icon?: string;
  color?: string;
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  currency: string;
  shipping_address: Address;
  billing_address?: Address;
  items: OrderItem[];
  notes?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  variant?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type Address = {
  first_name: string;
  last_name: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  title: string;
  body: string;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
};

export type Vendor = {
  id: string;
  user_id: string;
  store_name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  rating: number;
  review_count: number;
  product_count: number;
  is_verified: boolean;
  commission_rate: number;
  status: 'pending' | 'active' | 'suspended';
  created_at: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  min_order_amount?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  expires_at?: string;
  is_active: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
