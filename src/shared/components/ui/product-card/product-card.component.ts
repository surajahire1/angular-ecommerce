import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../core/models/product.interface';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showActions = true;

  constructor(private cartService: CartService) {}

  addToCart(): void {
    this.cartService.addToCart(this.product, 1);
  }

  get discountPrice(): number {
    return this.product.price * (1 - this.product.discountPercentage / 100);
  }

  get ratingArray(): number[] {
    return Array(Math.floor(this.product.rating)).fill(0);
  }
}
