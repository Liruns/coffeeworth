// src/lib/validations/support.ts

import { z } from 'zod';
import { MAX_MESSAGE_LENGTH } from '@/constants';

export const createSupportSchema = z.object({
  creatorUsername: z.string().min(1, '크리에이터를 선택해주세요'),
  coffeeCount: z.number().int().min(1, '최소 1잔 이상이어야 합니다').max(100, '최대 100잔까지 가능합니다'),
  message: z.string().max(MAX_MESSAGE_LENGTH, `최대 ${MAX_MESSAGE_LENGTH}자까지 가능합니다`).optional(),
  supporterName: z.string().max(50, '이름이 너무 깁니다').optional(),
  supporterEmail: z.string().email('올바른 이메일을 입력해주세요').optional().or(z.literal('')),
  isAnonymous: z.boolean().default(false),
});

export type CreateSupportInput = z.infer<typeof createSupportSchema>;
