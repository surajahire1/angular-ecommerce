import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem, AddToCartRequest } from '../models/cart.interface';
import { Product } from '../models/product.interface';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        this.cartSubject.next(cart);
      } catch (e) {
        localStorage.removeItem('cart');
      }
    }
  }

  private saveCartToStorage(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  getCart(): Cart | null {
    return this.cartSubject.value;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.value || this.createEmptyCart();

    const existingItem = currentCart.items.find(item => item.productId === product.id);

    if (existingItem) {
      // Update existing item
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      // Add new item
      const discountedPrice = product.price * (1 - product.discountPercentage / 100);
      const newItem: CartItem = {
        id: Date.now(),
        productId: product.id,
        product: product,
        quantity: quantity,
        price: discountedPrice,
        total: discountedPrice * quantity
      };
      currentCart.items.push(newItem);
    }

    this.updateCartTotals(currentCart);
    this.saveCartToStorage(currentCart);
  }

  updateQuantity(itemId: number, quantity: number): void {
    const cart = this.cartSubject.value;
    if (!cart) return;

    const item = cart.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      item.total = item.price * quantity;
      this.updateCartTotals(cart);
      this.saveCartToStorage(cart);
    }
  }

  removeItem(itemId: number): void {
    const cart = this.cartSubject.value;
    if (!cart) return;

    cart.items = cart.items.filter(item => item.id !== itemId);
    this.updateCartTotals(cart);
    this.saveCartToStorage(cart);
  }

  clearCart(): void {
    localStorage.removeItem('cart');
    this.cartSubject.next(null);
  }

  private createEmptyCart(): Cart {
    return {
      id: Date.now(),
      userId: 0,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      totalDiscount: 0,
      finalPrice: 0,
      createdAt: new Date().toISOString()
    };
  }

  private updateCartTotals(cart: Cart): void {
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);

    // Calculate total discount (difference between original price and discounted price)
    cart.totalDiscount = cart.items.reduce((sum, item) => {
      const originalTotal = item.product.price * item.quantity;
      return sum + (originalTotal - item.total);
    }, 0);

    // Calculate shipping
    const shipping = cart.totalPrice >= APP_CONSTANTS.FREE_SHIPPING_MIN ? 0 : APP_CONSTANTS.SHIPPING_COST;

    // Calculate tax
    const tax = cart.totalPrice * APP_CONSTANTS.TAX_RATE;

    cart.finalPrice = cart.totalPrice + shipping + tax;

    cart.updatedAt = new Date().toISOString();
  }

  getCartCount(): number {
    return this.cartSubject.value?.totalItems || 0;
  }

  getCartTotal(): number {
    return this.cartSubject.value?.finalPrice || 0;
  }

  // Check if cart is empty
  isEmpty(): boolean {
    return !this.cartSubject.value || this.cartSubject.value.items.length === 0;
  }

  // Get total items count (for badge)
  getItemCount(): number {
    return this.cartSubject.value?.totalItems || 0;
  }
}
