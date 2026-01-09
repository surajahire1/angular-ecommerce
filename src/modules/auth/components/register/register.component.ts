import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterFormData, RegisterData } from '../../../../core/models/user.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userData: RegisterFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '', // Now this is valid
    phone: '',
    agreeToTerms: false
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Validation
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Prepare registration data (remove confirmPassword)
    const registerData: RegisterData = {
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      password: this.userData.password,
      phone: this.userData.phone
    };

    this.authService.register(registerData).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Redirecting to home page...';

        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      }
    });
  }

  private validateForm(): boolean {
    // Check required fields
    if (!this.userData.firstName || !this.userData.lastName ||
        !this.userData.email || !this.userData.password ||
        !this.userData.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields.';
      return false;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userData.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }

    // Check password strength
    if (this.userData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return false;
    }

    // Check password match
    if (this.userData.password !== this.userData.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return false;
    }

    return true;
  }
}
