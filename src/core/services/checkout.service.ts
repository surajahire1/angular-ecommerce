// src/app/core/services/checkout.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { Order, CheckoutFormData, PaymentMethod } from '../models/order.interface';
import { Cart } from '../models/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private orders: Order[] = [];
  private paymentMethods: PaymentMethod[] = [
    {
      id: 'cc-1',
      type: 'credit-card',
      cardNumber: '4111111111111111',
      cardHolder: 'John Doe',
      expiryDate: '12/26',
      cvv: '123',
      isDefault: true,
      lastFourDigits: '1111'
    },
    {
      id: 'pp-1',
      type: 'paypal',
      isDefault: false
    },
    {
      id: 'ap-1',
      type: 'apple-pay',
      isDefault: false
    },
    {
      id: 'gp-1',
      type: 'google-pay',
      isDefault: false
    }
  ];

  constructor() {
    this.loadOrders();
  }

  private loadOrders(): void {
    const savedOrders = localStorage.getItem('user_orders');
    if (savedOrders) {
      try {
        this.orders = JSON.parse(savedOrders);
      } catch (e) {
        this.orders = [];
      }
    }
  }

  private saveOrders(): void {
    localStorage.setItem('user_orders', JSON.stringify(this.orders));
  }

  // Mock API calls for JSON Server
  createOrder(checkoutData: CheckoutFormData, cart: Cart): Observable<Order> {
    return new Observable(observer => {
      try {
        // Simulate API delay
        setTimeout(() => {
          const orderNumber = 'ORD-' + Date.now().toString().slice(-8);

          const order: Order = {
            id: Date.now(),
            orderNumber,
            userId: cart.userId || 1, // In real app, get from auth
            items: cart.items.map(item => ({
              id: item.id,
              productId: item.productId,
              productTitle: item.product.title,
              productImage: item.product.thumbnail,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.total,
              discount: item.product.discountPercentage
            })),
            shippingAddress: checkoutData.shippingAddress,
            billingAddress: checkoutData.billingAddress,
            paymentMethod: checkoutData.paymentMethod,
            shippingMethod: this.getShippingMethod(checkoutData.shippingMethodId),
            subtotal: cart.totalPrice,
            shippingCost: checkoutData.shippingMethodId === 'standard' ? 5.99 :
                         checkoutData.shippingMethodId === 'express' ? 12.99 : 24.99,
            taxAmount: cart.totalPrice * 0.08,
            discountAmount: cart.totalDiscount || 0,
            totalAmount: cart.finalPrice,
            status: 'pending',
            paymentStatus: 'paid',
            createdAt: new Date().toISOString(),
            estimatedDelivery: this.getEstimatedDelivery(checkoutData.shippingMethodId),
            notes: checkoutData.notes
          };

          this.orders.unshift(order);
          this.saveOrders();

          observer.next(order);
          observer.complete();
        }, 1500);
      } catch (error) {
        observer.error(error);
      }
    });
  }

  getOrders(userId: number): Observable<Order[]> {
    return of(this.orders.filter(order => order.userId === userId)).pipe(delay(500));
  }

  getOrder(orderId: number): Observable<Order | null> {
    const order = this.orders.find(o => o.id === orderId) || null;
    return of(order).pipe(delay(500));
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return of(this.paymentMethods).pipe(delay(300));
  }

  addPaymentMethod(paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    return new Observable(observer => {
      setTimeout(() => {
        this.paymentMethods.push(paymentMethod);
        observer.next(paymentMethod);
        observer.complete();
      }, 800);
    });
  }

  removePaymentMethod(paymentMethodId: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.paymentMethods.findIndex(pm => pm.id === paymentMethodId);
        if (index > -1) {
          this.paymentMethods.splice(index, 1);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 500);
    });
  }

  private getShippingMethod(id: string) {
    const methods = [
      { id: 'standard', name: 'Standard Shipping', cost: 5.99, days: '5-7 business days' },
      { id: 'express', name: 'Express Shipping', cost: 12.99, days: '2-3 business days' },
      { id: 'overnight', name: 'Overnight Shipping', cost: 24.99, days: '1 business day' }
    ];
    return methods.find(m => m.id === id) || methods[0];
  }

  private getEstimatedDelivery(shippingMethodId: string): string {
    const today = new Date();
    const deliveryDate = new Date(today);

    switch(shippingMethodId) {
      case 'overnight':
        deliveryDate.setDate(today.getDate() + 1);
        break;
      case 'express':
        deliveryDate.setDate(today.getDate() + 3);
        break;
      default:
        deliveryDate.setDate(today.getDate() + 7);
    }

    return deliveryDate.toISOString();
  }

  validateCreditCard(cardNumber: string, expiryDate: string, cvv: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        // Simple validation
        const isValid =
          cardNumber.replace(/\s/g, '').length === 16 &&
          /^\d{2}\/\d{2}$/.test(expiryDate) &&
          /^\d{3,4}$/.test(cvv);

        observer.next(isValid);
        observer.complete();
      }, 1000);
    });
  }
}
