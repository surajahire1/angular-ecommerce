import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationExtras } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { User } from '../../../../core/models/user.interface';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isUserMenuOpen = false; // For user dropdown
  searchQuery = '';
  currentUser: User | null = null;
  cartCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('User updated:', user);
    });

    // Subscribe to cart changes
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart?.totalItems || 0;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Get current route
      const currentRoute = this.router.url;

      // Check if we're already on products page
      if (currentRoute.includes('/products')) {
        // We're on products page, just update query params
        this.router.navigate([], {
          queryParams: { search: this.searchQuery.trim() },
          queryParamsHandling: 'merge'
        }).then(() => {
          // Clear search box
          this.searchQuery = '';
        });
      } else {
        // Navigate to products page with search query
        const queryParams: NavigationExtras = {
          queryParams: { search: this.searchQuery.trim() }
        };

        this.router.navigate(['/products'], queryParams);
        this.searchQuery = '';
      }

      this.isMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.isUserMenuOpen = false;
    this.isMenuOpen = false;
    this.router.navigate(['/']);
  }

  get userInitials(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get userDisplayName(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName} ${this.currentUser.lastName.charAt(0)}.`;
  }

  onClickOutsideUserMenu(): void {
    this.isUserMenuOpen = false;
  }
}
