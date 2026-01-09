// src/app/modules/checkout/components/checkout-page/checkout-page.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { Cart, CheckoutSummary } from '../../../../core/models/cart.interface';
import { CheckoutFormData, OrderAddress, PaymentMethod } from '../../../../core/models/order.interface';
import { LoadingSpinnerComponent } from '../../../../shared/components/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  // Current step
  currentStep: 'shipping' | 'payment' | 'review' = 'shipping';

  // Cart data
  cart: Cart | null = null;
  isLoading = true;

  // Form data
  checkoutData: CheckoutFormData = {
    shippingAddress: this.createEmptyAddress('shipping'),
    billingAddress: this.createEmptyAddress('billing'),
    sameAsShipping: true,
    paymentMethod: {} as PaymentMethod,
    shippingMethodId: 'standard',
    notes: ''
  };

  // Shipping options
  shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', cost: 5.99, days: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', cost: 12.99, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', cost: 24.99, days: '1 business day' }
  ];

  // Payment methods
  paymentMethods: PaymentMethod[] = [];
  selectedPaymentType: 'credit-card' | 'paypal' | 'apple-pay' | 'google-pay' = 'credit-card';

  // Credit card form
  creditCard = {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  };

  // Validation
  errors: { [key: string]: string } = {};
  isSubmitting = false;
  submitError = '';

  // Saved addresses (mock)
  savedAddresses: OrderAddress[] = [
    {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      addressLine1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
      addressType: 'shipping'
    }
  ];

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCart();
    this.loadPaymentMethods();

    // Check if coming from cart with saved summary
    const savedSummary = localStorage.getItem('checkout_summary');
    if (savedSummary) {
      console.log('Loaded saved checkout summary');
    }
  }

  ngOnDestroy(): void {
    // Clean up if needed
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.cart$.subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;

        if (!cart || cart.items.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.isLoading = false;
      }
    });
  }

  loadPaymentMethods(): void {
    this.checkoutService.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        const defaultMethod = methods.find(m => m.isDefault);
        if (defaultMethod) {
          this.checkoutData.paymentMethod = defaultMethod;
          this.selectedPaymentType = defaultMethod.type;
        }
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
      }
    });
  }

  createEmptyAddress(type: 'shipping' | 'billing'): OrderAddress {
    return {
      fullName: '',
      email: '',
      phone: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      addressType: type
    };
  }

  // Navigation between steps
  goToStep(step: 'shipping' | 'payment' | 'review'): void {
    if (this.validateCurrentStep()) {
      this.currentStep = step;
      window.scrollTo(0, 0);
    }
  }

  nextStep(): void {
    if (!this.validateCurrentStep()) return;

    switch (this.currentStep) {
      case 'shipping':
        this.currentStep = 'payment';
        break;
      case 'payment':
        this.currentStep = 'review';
        break;
      case 'review':
        this.placeOrder();
        break;
    }
    window.scrollTo(0, 0);
  }

  prevStep(): void {
    switch (this.currentStep) {
      case 'payment':
        this.currentStep = 'shipping';
        break;
      case 'review':
        this.currentStep = 'payment';
        break;
    }
    window.scrollTo(0, 0);
  }

  validateCurrentStep(): boolean {
    this.errors = {};

    switch (this.currentStep) {
      case 'shipping':
        return this.validateShippingStep();
      case 'payment':
        return this.validatePaymentStep();
      case 'review':
        return true; // Review step doesn't need validation
    }

    return false;
  }

  validateShippingStep(): boolean {
    const address = this.checkoutData.shippingAddress;
    let isValid = true;

    if (!address.fullName.trim()) {
      this.errors['shipping.fullName'] = 'Full name is required';
      isValid = false;
    }

    if (!address.email.trim()) {
      this.errors['shipping.email'] = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(address.email)) {
      this.errors['shipping.email'] = 'Please enter a valid email';
      isValid = false;
    }

    if (!address.phone.trim()) {
      this.errors['shipping.phone'] = 'Phone number is required';
      isValid = false;
    }

    if (!address.addressLine1.trim()) {
      this.errors['shipping.addressLine1'] = 'Address is required';
      isValid = false;
    }

    if (!address.city.trim()) {
      this.errors['shipping.city'] = 'City is required';
      isValid = false;
    }

    if (!address.state.trim()) {
      this.errors['shipping.state'] = 'State is required';
      isValid = false;
    }

    if (!address.zipCode.trim()) {
      this.errors['shipping.zipCode'] = 'ZIP code is required';
      isValid = false;
    }

    return isValid;
  }

  validatePaymentStep(): boolean {
    let isValid = true;

    if (this.selectedPaymentType === 'credit-card') {
      if (!this.creditCard.cardNumber.trim()) {
        this.errors['payment.cardNumber'] = 'Card number is required';
        isValid = false;
      } else if (this.creditCard.cardNumber.replace(/\s/g, '').length !== 16) {
        this.errors['payment.cardNumber'] = 'Card number must be 16 digits';
        isValid = false;
      }

      if (!this.creditCard.cardHolder.trim()) {
        this.errors['payment.cardHolder'] = 'Card holder name is required';
        isValid = false;
      }

      if (!this.creditCard.expiryDate.trim()) {
        this.errors['payment.expiryDate'] = 'Expiry date is required';
        isValid = false;
      } else if (!/^\d{2}\/\d{2}$/.test(this.creditCard.expiryDate)) {
        this.errors['payment.expiryDate'] = 'Format must be MM/YY';
        isValid = false;
      }

      if (!this.creditCard.cvv.trim()) {
        this.errors['payment.cvv'] = 'CVV is required';
        isValid = false;
      } else if (!/^\d{3,4}$/.test(this.creditCard.cvv)) {
        this.errors['payment.cvv'] = 'CVV must be 3 or 4 digits';
        isValid = false;
      }
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSameAsShippingChange(): void {
    if (this.checkoutData.sameAsShipping) {
      this.checkoutData.billingAddress = { ...this.checkoutData.shippingAddress, addressType: 'billing' };
    } else {
      this.checkoutData.billingAddress = this.createEmptyAddress('billing');
    }
  }

  selectSavedAddress(address: OrderAddress): void {
    this.checkoutData.shippingAddress = { ...address };
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.checkoutData.paymentMethod = method;
    this.selectedPaymentType = method.type;
  }

  useNewCard(): void {
    const newMethod: PaymentMethod = {
      id: 'cc-' + Date.now(),
      type: 'credit-card',
      cardNumber: this.creditCard.cardNumber,
      cardHolder: this.creditCard.cardHolder,
      expiryDate: this.creditCard.expiryDate,
      cvv: this.creditCard.cvv,
      isDefault: false,
      lastFourDigits: this.creditCard.cardNumber.slice(-4)
    };

    this.checkoutData.paymentMethod = newMethod;
  }

  getShippingCost(): number {
    const option = this.shippingOptions.find(o => o.id === this.checkoutData.shippingMethodId);
    return option ? option.cost : 0;
  }

  getTaxAmount(): number {
    return this.cart ? this.cart.totalPrice * 0.08 : 0;
  }

  getTotalAmount(): number {
    if (!this.cart) return 0;

    const shipping = this.getShippingCost();
    const tax = this.getTaxAmount();

    return this.cart.finalPrice + shipping + tax;
  }

  placeOrder(): void {
    if (!this.cart || this.isSubmitting) return;

    // For new credit card, create payment method
    if (this.selectedPaymentType === 'credit-card' && !this.checkoutData.paymentMethod.id) {
      this.useNewCard();
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.checkoutService.createOrder(this.checkoutData, this.cart).subscribe({
      next: (order) => {
        this.isSubmitting = false;

        // Clear cart
        this.cartService.clearCart();

        // Clear saved summary
        localStorage.removeItem('checkout_summary');

        // Navigate to confirmation
        this.router.navigate(['/checkout/confirmation', order.id]);
      },
      error: (error) => {
        console.error('Error placing order:', error);
        this.submitError = 'Failed to place order. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '');

    if (value.length > 16) {
      value = value.substring(0, 16);
    }

    // Add spaces every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = value;
    this.creditCard.cardNumber = value;
  }

  getProgressWidth(): string {
    switch (this.currentStep) {
      case 'shipping': return '33%';
      case 'payment': return '66%';
      case 'review': return '100%';
      default: return '33%';
    }
  }

  getStepStatus(step: string): string {
    const steps = ['shipping', 'payment', 'review'];
    const currentIndex = steps.indexOf(this.currentStep);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  }

  get selectedShippingMethod() {
    return this.shippingOptions.find(o => o.id === this.checkoutData.shippingMethodId);
  }

  get selectedShippingName() {
    return this.selectedShippingMethod?.name || '';
  }

  get selectedShippingDays() {
    return this.selectedShippingMethod?.days || '';
  }

  // Payment method display
  get paymentMethodDisplay() {
    if (this.selectedPaymentType === 'credit-card') {
      const lastFour = this.checkoutData.paymentMethod.lastFourDigits;
      return `Credit Card${lastFour ? ' (•••• ' + lastFour + ')' : ''}`;
    } else if (this.selectedPaymentType === 'paypal') {
      return 'PayPal';
    } else if (this.selectedPaymentType === 'apple-pay') {
      return 'Apple Pay';
    } else {
      return 'Google Pay';
    }
  }

  // Card holder name display
  get cardHolderDisplay() {
    return this.checkoutData.paymentMethod.cardHolder || '';
  }

}
