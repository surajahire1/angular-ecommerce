// src/app/modules/checkout/checkout.routes.ts (not .is)
import { Routes } from '@angular/router';
import { CheckoutPageComponent } from './components/checkout-page/checkout-page.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    component: CheckoutPageComponent,
    title: 'Checkout - ShopEZ'
  },
  {
    path: 'confirmation/:orderId',
    component: OrderConfirmationComponent,
    title: 'Order Confirmation - ShopEZ'
  }
];
