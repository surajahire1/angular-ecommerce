// Application-wide constants
export const APP_CONSTANTS = {
  // Currency & Pricing
  CURRENCY: 'USD',
  CURRENCY_SYMBOL: '$',
  TAX_RATE: 0.08, // 8%
  SHIPPING_COST: 5.99,
  FREE_SHIPPING_MIN: 50,

  // Cart
  MAX_CART_QUANTITY: 99,
  MIN_CART_QUANTITY: 1,

  // User
  DEFAULT_USER_ROLE: 'user',
  ADMIN_ROLE: 'admin',

  // Product
  DEFAULT_PRODUCT_IMAGE: 'https://via.placeholder.com/300x300?text=No+Image',
  PRODUCT_RATING_MAX: 5,

  // Order
  ORDER_STATUSES: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  } as const,

  PAYMENT_METHODS: {
    CREDIT_CARD: 'credit_card',
    PAYPAL: 'paypal',
    CASH_ON_DELIVERY: 'cash_on_delivery',
    BANK_TRANSFER: 'bank_transfer'
  } as const,

  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  } as const,

  // Validation
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  NAME_MAX_LENGTH: 50,
  PHONE_MAX_LENGTH: 20,

  // UI
  DEBOUNCE_TIME: 300, // ms
  TOAST_DURATION: 3000, // ms
  AUTO_LOGOUT_MINUTES: 30,

  // Local Storage Keys
  STORAGE_KEYS: {
    USER: 'user',
    TOKEN: 'auth_token',
    CART: 'cart',
    THEME: 'theme',
    LANGUAGE: 'language',
    RECENT_SEARCHES: 'recent_searches'
  },

  // Pagination
  ITEMS_PER_PAGE: 12,
  PAGE_RANGE_DISPLAYED: 5,

  // Date Format
  DATE_FORMAT: 'MM/DD/YYYY',
  DATE_TIME_FORMAT: 'MM/DD/YYYY HH:mm',

  // Regex Patterns
  REGEX: {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE: /^[\+]?[1-9][0-9]{9,14}$/,
    ZIP_CODE: /^\d{5}(-\d{4})?$/,
    CREDIT_CARD: /^\d{16}$/,
    CVV: /^\d{3,4}$/
  }
};

// Feature flags (for enabling/disabling features)
export const FEATURE_FLAGS = {
  ENABLE_REVIEWS: true,
  ENABLE_WISHLIST: true,
  ENABLE_COMPARE: true,
  ENABLE_COUPONS: true,
  ENABLE_MULTI_CURRENCY: false,
  ENABLE_MULTI_LANGUAGE: false
};


// Default values
export const DEFAULTS = {
  USER_AVATAR: 'https://via.placeholder.com/150x150?text=User',
  PRODUCT_THUMBNAIL: 'https://via.placeholder.com/300x300?text=Product',
  CATEGORY_IMAGE: 'https://via.placeholder.com/200x200?text=Category',
  SHIPPING_ADDRESS: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  },
  BILLING_ADDRESS: {
    sameAsShipping: true
  }
};

const IS_PRODUCTION = window.location.hostname !== 'localhost'
  && !window.location.hostname.includes('127.0.0.1');

// Environment-specific settings (would be replaced by environment files)
export const ENVIRONMENT = {
  PRODUCTION: IS_PRODUCTION,
  DEBUG: !IS_PRODUCTION,
  VERSION: '1.0.0',
  BUILD_TIMESTAMP: new Date().toISOString()
};

