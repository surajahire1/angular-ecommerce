// src/app/modules/checkout/components/order-confirmation/order-confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { Order } from '../../../../core/models/order.interface';
import { LoadingSpinnerComponent } from '../../../../shared/components/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;
  error = '';
  orderId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckoutService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = +params['orderId'];
      if (this.orderId) {
        this.loadOrder(this.orderId);
      } else {
        this.error = 'Invalid order ID';
        this.isLoading = false;
      }
    });
  }

  loadOrder(orderId: number): void {
    this.isLoading = true;
    this.checkoutService.getOrder(orderId).subscribe({
      next: (order: Order | null) => {
        if (order) {
          this.order = order;
        } else {
          this.error = 'Order not found';
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading order:', error);
        this.error = 'Failed to load order details';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getEstimatedDeliveryDate(): string {
    if (!this.order?.estimatedDelivery) return '';
    const date = new Date(this.order.estimatedDelivery);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  viewOrderDetails(): void {
    // In real app, navigate to order details page
    // For now, just reload
    if (this.orderId) {
      this.loadOrder(this.orderId);
    }
  }

  printOrder(): void {
    window.print();
  }

  getPaymentMethodIcon(type: string): string {
    switch (type) {
      case 'credit-card': return 'fa-cc-visa';
      case 'paypal': return 'fa-cc-paypal';
      case 'apple-pay': return 'fa-cc-apple-pay';
      case 'google-pay': return 'fab fa-google-pay';
      default: return 'fa-credit-card';
    }
  }

  getPaymentMethodColor(type: string): string {
    switch (type) {
      case 'credit-card': return 'text-primary';
      case 'paypal': return 'text-info';
      case 'apple-pay': return 'text-dark';
      case 'google-pay': return 'text-success';
      default: return 'text-secondary';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'processing': return 'bg-info';
      case 'shipped': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getPaymentStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'paid': return 'bg-success';
      case 'failed': return 'bg-danger';
      case 'refunded': return 'bg-secondary';
      default: return 'bg-light';
    }
  }
}
