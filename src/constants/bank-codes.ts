// src/constants/bank-codes.ts

export const BANK_CODES = {
  '004': '국민은행',
  '011': '농협은행',
  '020': '우리은행',
  '023': 'SC제일은행',
  '027': '한국씨티은행',
  '032': '대구은행',
  '034': '광주은행',
  '035': '제주은행',
  '037': '전북은행',
  '039': '경남은행',
  '045': '새마을금고',
  '048': '신협',
  '050': '저축은행',
  '071': '우체국',
  '081': '하나은행',
  '088': '신한은행',
  '089': '케이뱅크',
  '090': '카카오뱅크',
  '092': '토스뱅크',
} as const;

export type BankCode = keyof typeof BANK_CODES;

export const BANK_OPTIONS = Object.entries(BANK_CODES).map(([code, name]) => ({
  value: code,
  label: name,
}));
