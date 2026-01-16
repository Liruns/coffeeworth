// src/types/api.ts

// API Response Types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Error Codes
export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'PAYMENT_FAILED'
  | 'INTERNAL_ERROR'
  | 'DUPLICATE_USERNAME'
  | 'INVALID_USERNAME'
  | 'INSUFFICIENT_BALANCE';

// Request Types
export interface CreateSupportRequest {
  creatorUsername: string;
  coffeeCount: number;
  message?: string;
  supporterName?: string;
  supporterEmail?: string;
  isAnonymous?: boolean;
}

export interface CreateSupportResponse {
  orderId: string;
  amount: number;
  orderName: string;
}

export interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface ConfirmPaymentResponse {
  supportId: string;
  redirectUrl: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  coffeePrice?: number;
  themeColor?: string;
  socialLinks?: Record<string, string>;
  bankCode?: string;
  bankAccount?: string;
  bankHolder?: string;
  emailNotify?: boolean;
}

export interface UpdateUsernameRequest {
  username: string;
}

export interface CreatePayoutRequest {
  amount: number;
}

// Query Params
export interface SupportsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  from?: string;
  to?: string;
}

export interface StatsQueryParams {
  period?: 'week' | 'month' | 'year';
}
