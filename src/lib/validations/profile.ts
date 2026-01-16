// src/lib/validations/profile.ts

import { z } from 'zod';
import {
  MAX_NAME_LENGTH,
  MAX_BIO_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_REGEX,
  MIN_COFFEE_PRICE,
  MAX_COFFEE_PRICE,
} from '@/constants';

export const usernameSchema = z
  .string()
  .min(USERNAME_MIN_LENGTH, `최소 ${USERNAME_MIN_LENGTH}자 이상이어야 합니다`)
  .max(USERNAME_MAX_LENGTH, `최대 ${USERNAME_MAX_LENGTH}자까지 가능합니다`)
  .regex(USERNAME_REGEX, '영문 소문자, 숫자, 밑줄(_)만 사용할 수 있습니다');

export const updateProfileSchema = z.object({
  name: z
    .string()
    .max(MAX_NAME_LENGTH, `최대 ${MAX_NAME_LENGTH}자까지 가능합니다`)
    .optional(),
  bio: z
    .string()
    .max(MAX_BIO_LENGTH, `최대 ${MAX_BIO_LENGTH}자까지 가능합니다`)
    .optional(),
  coffeePrice: z
    .number()
    .int()
    .min(MIN_COFFEE_PRICE, `최소 ${MIN_COFFEE_PRICE.toLocaleString()}원 이상이어야 합니다`)
    .max(MAX_COFFEE_PRICE, `최대 ${MAX_COFFEE_PRICE.toLocaleString()}원까지 가능합니다`)
    .optional(),
  themeColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '올바른 색상 코드를 입력해주세요')
    .optional(),
  socialLinks: z
    .object({
      github: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
      twitter: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
      instagram: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
      youtube: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
      blog: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
      website: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
    })
    .optional(),
  bankCode: z.string().optional(),
  bankAccount: z.string().max(20, '계좌번호가 너무 깁니다').optional(),
  bankHolder: z.string().max(20, '예금주명이 너무 깁니다').optional(),
  emailNotify: z.boolean().optional(),
});

export const updateUsernameSchema = z.object({
  username: usernameSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateUsernameInput = z.infer<typeof updateUsernameSchema>;
