// src/types/index.ts

import type { BankCode } from '@/constants/bank-codes';
import type { SocialPlatform } from '@/constants';

// User
export interface User {
  id: string;
  email: string | null;
  name: string | null;
  username: string | null;
  image: string | null;
  bio: string | null;
  coffeePrice: number;
  themeColor: string;
  socialLinks: SocialLinks | null;
  bankCode: BankCode | null;
  bankAccount: string | null;
  bankHolder: string | null;
  emailNotify: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SocialLinks = Partial<Record<SocialPlatform, string>>;

// Creator (Public Profile)
export interface Creator {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  coffeePrice: number;
  themeColor: string;
  socialLinks: SocialLinks | null;
  totalSupporters: number;
  totalCoffees: number;
}

// Support
export type SupportStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Support {
  id: string;
  creatorId: string;
  coffeeCount: number;
  unitPrice: number;
  amount: number;
  message: string | null;
  supporterName: string | null;
  supporterEmail: string | null;
  isAnonymous: boolean;
  orderId: string;
  paymentKey: string | null;
  paymentMethod: string | null;
  status: SupportStatus;
  paidAt: Date | null;
  platformFee: number | null;
  pgFee: number | null;
  netAmount: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Payout
export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Payout {
  id: string;
  userId: string;
  amount: number;
  bankCode: BankCode;
  bankAccount: string;
  bankHolder: string;
  status: PayoutStatus;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Stats
export interface CreatorStats {
  totalSupports: number;
  totalCoffees: number;
  totalAmount: number;
  totalNetAmount: number;
  pendingPayout: number;
  thisMonthSupports: number;
  thisMonthAmount: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
