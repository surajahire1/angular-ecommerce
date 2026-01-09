import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Product, ProductCategory, ProductFilter } from '../models/product.interface';
import { User, LoginCredentials, RegisterData } from '../models/user.interface';
import { Cart, AddToCartRequest } from '../models/cart.interface';
import { Order } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpService) {}

  // Product endpoints
  getProducts(filter?: ProductFilter): Observable<Product[]> {
    return this.http.get<Product[]>(API_ENDPOINTS.PRODUCTS.BASE, filter);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(API_ENDPOINTS.PRODUCTS.SEARCH(query));
  }

  // Auth endpoints
  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  register(userData: RegisterData): Observable<User> {
    return this.http.post<User>(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  // Cart endpoints
  getCart(userId: number): Observable<Cart> {
    return this.http.get<Cart>(API_ENDPOINTS.CART.USER_CART(userId));
  }

  addToCart(request: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(API_ENDPOINTS.CART.BASE, request);
  }

  updateCartItem(itemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${API_ENDPOINTS.CART.BASE}/${itemId}`, { quantity });
  }

  removeFromCart(itemId: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.CART.BASE}/${itemId}`);
  }

  // Order endpoints
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(API_ENDPOINTS.ORDERS.BASE, order);
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(API_ENDPOINTS.ORDERS.USER_ORDERS(userId));
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${API_ENDPOINTS.ORDERS.BASE}/${orderId}`);
  }
}
