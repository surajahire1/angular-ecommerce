import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { Cart, CartItem } from '../../../../core/models/cart.interface';
import { Product } from '../../../../core/models/product.interface';
import { LoadingSpinnerComponent } from '../../../../shared/components/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  isLoading = false;

  // Promo code
  promoCode = '';
  appliedPromo = '';
  discountAmount = 0;
  promoError = '';

  // Shipping options
  shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', cost: 5.99, days: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', cost: 12.99, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', cost: 24.99, days: '1 business day' }
  ];
  selectedShipping = 'standard';

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.cart$.subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
        this.calculateDiscount();
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.isLoading = false;
      }
    });
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(item.id);
      return;
    }

    if (quantity > item.product.stock) {
      alert(`Only ${item.product.stock} items available in stock`);
      return;
    }

    this.cartService.updateQuantity(item.id, quantity);
  }

  removeItem(itemId: number): void {
    if (confirm('Are you sure you want to remove this item from cart?')) {
      this.cartService.removeItem(itemId);
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  applyPromoCode(): void {
    this.promoError = '';

    if (!this.promoCode.trim()) {
      this.promoError = 'Please enter a promo code';
      return;
    }

    // Mock promo codes (in real app, validate with backend)
    const validPromos = [
      { code: 'SAVE10', discount: 0.10, type: 'percentage' },
      { code: 'SAVE20', discount: 0.20, type: 'percentage' },
      { code: 'FREESHIP', discount: 'free-shipping', type: 'shipping' },
      { code: 'FIVEOFF', discount: 5, type: 'fixed' }
    ];

    const promo = validPromos.find(p => p.code === this.promoCode.toUpperCase());

    if (promo) {
      this.appliedPromo = this.promoCode.toUpperCase();
      this.promoCode = '';
      this.calculateDiscount();
    } else {
      this.promoError = 'Invalid promo code';
    }
  }

  removePromoCode(): void {
    this.appliedPromo = '';
    this.promoCode = '';
    this.discountAmount = 0;
    this.promoError = '';
  }

  calculateDiscount(): void {
    if (!this.cart || !this.appliedPromo) {
      this.discountAmount = 0;
      return;
    }

    // Mock discount calculation
    const promo = this.appliedPromo;
    let discount = 0;

    if (promo === 'SAVE10') {
      discount = this.cart.totalPrice * 0.10;
    } else if (promo === 'SAVE20') {
      discount = this.cart.totalPrice * 0.20;
    } else if (promo === 'FIVEOFF') {
      discount = 5;
    }

    this.discountAmount = Math.min(discount, this.cart.totalPrice);
  }

  getShippingCost(): number {
    if (this.appliedPromo === 'FREESHIP') {
      return 0;
    }

    const shipping = this.shippingOptions.find(s => s.id === this.selectedShipping);
    return shipping ? shipping.cost : 0;
  }

  getTaxAmount(): number {
    if (!this.cart) return 0;
    return (this.cart.totalPrice - this.discountAmount) * 0.08; // 8% tax
  }

  getTotalAmount(): number {
    if (!this.cart) return 0;

    const subtotal = this.cart.totalPrice - this.discountAmount;
    const shipping = this.getShippingCost();
    const tax = this.getTaxAmount();

    return subtotal + shipping + tax;
  }

  proceedToCheckout(): void {
    if (!this.cart || this.cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Save cart state (in real app, save to backend)
    const orderSummary = {
      subtotal: this.cart.totalPrice,
      discount: this.discountAmount,
      shipping: this.getShippingCost(),
      tax: this.getTaxAmount(),
      total: this.getTotalAmount(),
      items: this.cart.items.length
    };

    localStorage.setItem('checkout_summary', JSON.stringify(orderSummary));
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  isCartEmpty(): boolean {
    return !this.cart || this.cart.items.length === 0;
  }
}
