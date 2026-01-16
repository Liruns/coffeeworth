// src/constants/index.ts

// App
export const APP_NAME = '커피값좀';
export const APP_NAME_EN = 'coffeeworth';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://coffeeworth.kr';

// Coffee Settings
export const DEFAULT_COFFEE_PRICE = 3000;
export const MIN_COFFEE_PRICE = 1000;
export const MAX_COFFEE_PRICE = 100000;
export const COFFEE_PRESETS = [1, 3, 5] as const;
export const DEFAULT_COFFEE_EMOJI = '☕';

// Fees
export const PLATFORM_FEE_RATE = 0.05; // 5%
export const PG_FEE_RATE = 0.028; // 약 2.8%

// Payout
export const MIN_PAYOUT_AMOUNT = 10000; // 최소 정산 금액
export const PAYOUT_DAY = 5; // 금요일

// Limits
export const MAX_MESSAGE_LENGTH = 200;
export const MAX_BIO_LENGTH = 500;
export const MAX_NAME_LENGTH = 50;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_REGEX = /^[a-z0-9_]+$/;

// Theme
export const DEFAULT_THEME_COLOR = '#FFDD00';

// Social Links
export const SOCIAL_PLATFORMS = [
  'github',
  'twitter',
  'instagram',
  'youtube',
  'blog',
  'website',
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
