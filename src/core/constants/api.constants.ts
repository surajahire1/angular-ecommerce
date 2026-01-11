// Determine if we're in production
const IS_PRODUCTION = window.location.hostname !== 'localhost'
  && !window.location.hostname.includes('127.0.0.1');

// Base URL for API
export const API_BASE_URL = IS_PRODUCTION
  ? 'https://ecommerce-backend.onrender.com'  // Your production Render URL
  : 'http://localhost:3000';                  // Local development

// API endpoints - they will automatically use the correct base URL
export const API_ENDPOINTS = {
  // Products endpoints
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: number | string) => `/products/${id}`,
    BY_CATEGORY: (category: string) => `/products?category=${category}`,
    SEARCH: (query: string) => `/products?title_like=${query}&description_like=${query}`,
    PAGINATE: (page: number, limit: number) => `/products?_page=${page}&_limit=${limit}`,
    SORT: (sortBy: string, order: 'asc' | 'desc') => `/products?_sort=${sortBy}&_order=${order}`,
    CATEGORIES: '/categories',
    CATEGORY_BY_ID: (id: number) => `/categories/${id}`,
    CATEGORY_BY_SLUG: (slug: string) => `/categories?slug=${slug}`
  },

  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/users/me',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh'
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    PROFILE: (id: number) => `/users/${id}/profile`,
    UPDATE_PROFILE: (id: number) => `/users/${id}`,
    CHANGE_PASSWORD: (id: number) => `/users/${id}/password`
  },

  // Cart endpoints
  CART: {
    BASE: '/carts',
    USER_CART: (userId: number) => `/carts?userId=${userId}&_embed=items`,
    ADD_ITEM: '/cart-items',
    UPDATE_ITEM: (itemId: number) => `/cart-items/${itemId}`,
    REMOVE_ITEM: (itemId: number) => `/cart-items/${itemId}`,
    CLEAR_CART: (cartId: number) => `/carts/${cartId}/items`
  },

  // Order endpoints
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: number) => `/orders/${id}`,
    USER_ORDERS: (userId: number) => `/orders?userId=${userId}`,
    CREATE: '/orders',
    UPDATE_STATUS: (orderId: number) => `/orders/${orderId}/status`,
    CANCEL: (orderId: number) => `/orders/${orderId}/cancel`
  },

  // Wishlist endpoints
  WISHLIST: {
    BASE: '/wishlists',
    USER_WISHLIST: (userId: number) => `/wishlists?userId=${userId}`,
    ADD_ITEM: '/wishlist-items',
    REMOVE_ITEM: (itemId: number) => `/wishlist-items/${itemId}`
  },

  // Review endpoints
  REVIEWS: {
    BASE: '/reviews',
    PRODUCT_REVIEWS: (productId: number) => `/reviews?productId=${productId}`,
    USER_REVIEWS: (userId: number) => `/reviews?userId=${userId}`,
    ADD: '/reviews',
    UPDATE: (reviewId: number) => `/reviews/${reviewId}`,
    DELETE: (reviewId: number) => `/reviews/${reviewId}`
  },

  // Payment endpoints
  PAYMENTS: {
    BASE: '/payments',
    CREATE_INTENT: '/payments/create-intent',
    CONFIRM: '/payments/confirm',
    HISTORY: (userId: number) => `/payments?userId=${userId}`
  }
};

// Helper function to get full URL
export function getFullUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  UPLOAD_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  IS_PRODUCTION: IS_PRODUCTION
};

export const API_ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR'
};

export const API_HEADERS = {
  CONTENT_TYPE: {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    TEXT: 'text/plain'
  },
  ACCEPT: {
    JSON: 'application/json',
    ALL: '*/*'
  }
};

// Query parameter constants
export const QUERY_PARAMS = {
  PAGE: '_page',
  LIMIT: '_limit',
  SORT: '_sort',
  ORDER: '_order',
  EXPAND: '_expand',
  EMBED: '_embed',
  SEARCH: 'q',
  CATEGORY: 'category',
  MIN_PRICE: 'price_gte',
  MAX_PRICE: 'price_lte',
  RATING: 'rating_gte'
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS'
};

// Response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};
