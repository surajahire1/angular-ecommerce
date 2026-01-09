import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="auth-layout min-vh-100 d-flex align-items-center justify-content-center">
      <div class="w-100">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem 1rem;
    }

    @media (min-width: 768px) {
      .auth-layout {
        padding: 3rem 1rem;
      }
    }
  `]
})
export class AuthLayoutComponent {}
