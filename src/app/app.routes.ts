import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../shared/layouts/main-layout/main-layout.component')
      .then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('../modules/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'products',
        loadChildren: () => import('../modules/products/products.routes')
          .then(m => m.PRODUCTS_ROUTES)
      },
      {
        path: 'cart',
        loadComponent: () => import('../modules/cart/components/cart/cart.component')
          .then(m => m.CartComponent)
      },
      {
        path: 'checkout',
        loadComponent: () => import('../modules/checkout/components/checkout-page/checkout-page.component')
          .then(m => m.CheckoutPageComponent)
      },
      {
        path: 'checkout/confirmation/:orderId',
        loadComponent: () => import('../modules/checkout/components/order-confirmation/order-confirmation.component')
          .then(m => m.OrderConfirmationComponent)
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('../modules/auth/auth.routes')
      .then(m => m.AUTH_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
