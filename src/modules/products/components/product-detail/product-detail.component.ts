import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { CartService } from '../../../../core/services/cart.service';
import { Product } from '../../../../core/models/product.interface';
import { ProductCardComponent } from '../../../../shared/components/ui/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductCardComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  isLoading = false;
  errorMessage = '';

  // Product options
  selectedImageIndex = 0;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId || isNaN(+productId)) {
      this.errorMessage = 'Invalid product ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getProductById(+productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        this.loadRelatedProducts(product.category);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Product not found or error loading product.';
        console.error('Error loading product:', error);
      }
    });
  }

  loadRelatedProducts(category: string): void {
    this.apiService.getProducts().subscribe({
      next: (products) => {
        // Filter products by same category, excluding current product
        this.relatedProducts = products
          .filter(p =>
            p.category === category &&
            p.id !== this.product?.id
          )
          .slice(0, 4); // Show max 4 related products
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    this.cartService.addToCart(this.product, this.quantity);

    // Show success message (you can add a toast/notification later)
    alert(`${this.quantity} × ${this.product.title} added to cart!`);

    // Reset quantity
    this.quantity = 1;
  }

  buyNow(): void {
    if (!this.product) return;

    this.cartService.addToCart(this.product, this.quantity);
    this.router.navigate(['/cart']);
  }

  get discountPrice(): number {
    if (!this.product) return 0;
    return this.product.price * (1 - this.product.discountPercentage / 100);
  }

  get ratingArray(): number[] {
    if (!this.product) return [];
    return Array(Math.floor(this.product.rating)).fill(0);
  }

  get hasHalfStar(): boolean {
    if (!this.product) return false;
    return this.product.rating % 1 !== 0;
  }

  get stockStatus(): string {
    if (!this.product) return 'Out of stock';

    if (this.product.stock > 10) return 'In stock';
    if (this.product.stock > 0) return `Only ${this.product.stock} left`;
    return 'Out of stock';
  }

  get stockStatusClass(): string {
    if (!this.product) return 'text-danger';

    if (this.product.stock > 10) return 'text-success';
    if (this.product.stock > 0) return 'text-warning';
    return 'text-danger';
  }

  isOutOfStock(): boolean {
    return !this.product || this.product.stock === 0;
  }
}
