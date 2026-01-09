import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductCardComponent } from '../../../../shared/components/ui/product-card/product-card.component';
import { ApiService } from '../../../../core/services/api.service';
import { Product, ProductCategory, ProductFilter } from '../../../../core/models/product.interface';
import { LoadingSpinnerComponent } from '../../../../shared/components/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductCardComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: ProductCategory[] = [];
  isLoading = false;
  searchQuery = '';

  // Filters
  filters: ProductFilter = {
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    rating: 0,
    sortBy: 'price',
    sortOrder: 'asc'
  };

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  // UI State
  showFilters = false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router  // Add Router
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  // In product-list.component.ts - Update ngOnInit
  private loadAllData(): void {
    this.isLoading = true;

    forkJoin({
      products: this.apiService.getProducts(),
      categories: this.apiService.getCategories()
    }).subscribe({
      next: ({ products, categories }) => {
        this.products = products;
        this.categories = categories;
        this.filteredProducts = [...products];
        this.updatePagination();
        this.isLoading = false;

        // Listen to query params changes (for search from header)
        this.route.queryParams.subscribe(params => {
          if (params['search']) {
            this.searchQuery = params['search'];
            this.applyFilters();
          } else if (this.searchQuery) {
            // If search was cleared from URL, clear local search
            this.searchQuery = '';
            this.applyFilters();
          }
        });

        // Listen to route params (for category)
        this.route.params.subscribe(params => {
          if (params['category']) {
            this.filters.category = params['category'];
          } else {
            this.filters.category = '';
          }
          this.applyFilters();
        });
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    });
  }

  private handleRouteAndQueryParams(): void {
    // Subscribe to query params for search
    this.route.queryParams.subscribe(queryParams => {
      // Handle search query from URL
      if (queryParams['search']) {
        this.searchQuery = queryParams['search'];
      } else {
        this.searchQuery = '';
      }
    });

    // Subscribe to route params for category
    this.route.params.subscribe(params => {
      // Handle category from route
      if (params['category']) {
        this.filters.category = params['category'];
      } else {
        this.filters.category = '';
      }

      // Apply filters with both category and search
      this.applyFilters();
    });

    // Also check initial params
    const initialParams = this.route.snapshot.params;
    const initialQueryParams = this.route.snapshot.queryParams;

    if (initialQueryParams['search']) {
      this.searchQuery = initialQueryParams['search'];
    }

    if (initialParams['category']) {
      this.filters.category = initialParams['category'];
    }

    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Category filter
    if (this.filters.category) {
      filtered = filtered.filter(p =>
        p.category.toLowerCase() === this.filters.category?.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(p =>
      p.price >= (this.filters.minPrice || 0) &&
      p.price <= (this.filters.maxPrice || 10000)
    );

    // Rating filter
    if (this.filters.rating && this.filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= this.filters.rating!);
    }

    // Search filter - from header or local
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (this.filters.sortBy) {
        case 'price':
          aValue = a.price * (1 - a.discountPercentage / 100);
          bValue = b.price * (1 - b.discountPercentage / 100);
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'name':
          aValue = a.title;
          bValue = b.title;
          break;
        default:
          aValue = a.price;
          bValue = b.price;
      }

      if (this.filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredProducts = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  // Update the onSearch method to update URL
  onSearch(): void {
    this.currentPage = 1;

    // Update URL with search query
    const queryParams: any = {};

    if (this.searchQuery.trim()) {
      queryParams['search'] = this.searchQuery.trim();
    }

    // Keep existing category if present
    if (this.filters.category) {
      // Navigate with both category and search
      this.router.navigate([`/products/category/${this.filters.category}`], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
    } else {
      // Navigate to products page with search
      this.router.navigate(['/products'], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
    }

    this.applyFilters();
  }

  // Update clear search to also update URL
  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;

    // Remove search from URL
    const queryParams = { ...this.route.snapshot.queryParams };
    delete queryParams['search'];

    this.router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });

    this.applyFilters();
  }

  resetFilters(): void {
    this.filters = {
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      rating: 0,
      sortBy: 'price',
      sortOrder: 'asc'
    };
    this.searchQuery = '';

    // Navigate to base products page
    this.router.navigate(['/products'], {
      queryParams: {},
      queryParamsHandling: 'merge'
    });

    this.applyFilters();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getActiveCategory(): string {
    return this.categories.find(c => c.slug === this.filters.category)?.name || 'All Categories';
  }

  getProductCount(): number {
    return this.filteredProducts.length;
  }

  get displayRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
    return `Showing ${start} - ${end} of ${this.filteredProducts.length} products`;
  }

  // Add this method to show search results info
  getSearchInfo(): string {
    if (this.searchQuery.trim()) {
      return `Search results for "${this.searchQuery}"`;
    }
    return '';
  }
}
