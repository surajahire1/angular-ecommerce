import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;
  isSubmitted = false;
  errorMessage = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.isSubmitted = true;

      // In a real app, you would call an API here
      console.log('Password reset requested for:', this.email);
    }, 1500);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
