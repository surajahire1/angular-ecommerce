import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  passwordData = {
    newPassword: '',
    confirmPassword: ''
  };

  isLoading = false;
  isCompleted = false;
  errorMessage = '';
  token = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get token from URL (in real app)
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  onSubmit(): void {
    // Validation
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.isCompleted = true;

      // In a real app, you would call an API here
      console.log('Password reset with token:', this.token);
    }, 1500);
  }

  private validateForm(): boolean {
    // Check required fields
    if (!this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return false;
    }

    // Check password strength
    if (this.passwordData.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return false;
    }

    // Check password match
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return false;
    }

    return true;
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
