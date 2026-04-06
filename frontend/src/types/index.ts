export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  color: string;
  icon: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category | string;
  stock: number;
  unit: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  user: User | string;
  items: {
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: string;
  note?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalCategories: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}
