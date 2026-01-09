// src/app/core/models/order.interface.ts
export interface OrderAddress {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
  addressType: 'shipping' | 'billing';
}

export interface PaymentMethod {
  id: string;
  type: 'credit-card' | 'paypal' | 'apple-pay' | 'google-pay';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  isDefault?: boolean;
  lastFourDigits?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  estimatedDelivery?: string;
  shippingMethod: {
    id: string;
    name: string;
    cost: number;
    days: string;
  };
  notes?: string;
}

export interface CheckoutFormData {
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  sameAsShipping: boolean;
  paymentMethod: PaymentMethod;
  shippingMethodId: string;
  notes?: string;
  promoCode?: string;
}
