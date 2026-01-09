export interface User {
  id: number;
  email: string;
  username: string;
  password?: string; // Optional in frontend, required for registration
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: Address;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string; // Add this
  phone?: string;
  address?: Address;
  agreeToTerms?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: Address;
}
