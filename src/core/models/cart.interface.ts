import { Product } from "./product.interface";

export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number; // Price per unit after discount
  total: number; // price * quantity
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

// For checkout summary
export interface CheckoutSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  items: number;
}
