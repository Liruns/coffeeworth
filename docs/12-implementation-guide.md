# 12. 구현 가이드 (AI Agent용)

> 이 문서는 AI Agent가 코드를 생성할 때 참고하는 구현 가이드입니다.

## 프로젝트 초기화

### 1. Next.js 프로젝트 생성

```bash
npx create-next-app@latest coffeeworth --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd coffeeworth
```

### 2. 필수 패키지 설치

```bash
# UI
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install lucide-react

# 폼 & 검증
npm install react-hook-form @hookform/resolvers zod

# 인증
npm install next-auth @auth/prisma-adapter

# DB
npm install prisma @prisma/client
npx prisma init

# 결제 (토스페이먼츠)
npm install @tosspayments/payment-sdk

# 이메일
npm install resend

# 유틸
npm install date-fns nanoid
```

### 3. shadcn/ui 설정

```bash
npx shadcn-ui@latest init

# 필요한 컴포넌트 설치
npx shadcn-ui@latest add button input textarea label card avatar badge
npx shadcn-ui@latest add dialog dropdown-menu toast tabs table
npx shadcn-ui@latest add form select separator skeleton
```

---

## 폴더 구조

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # 랜딩 페이지
│   │   ├── login/page.tsx              # 로그인
│   │   └── @[username]/
│   │       ├── page.tsx                # 크리에이터 페이지
│   │       └── thanks/page.tsx         # 후원 완료
│   │
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── layout.tsx              # 대시보드 레이아웃
│   │       ├── page.tsx                # 대시보드 홈
│   │       ├── supporters/page.tsx     # 후원 내역
│   │       ├── payouts/page.tsx        # 정산
│   │       ├── tools/page.tsx          # 연동 도구
│   │       └── settings/page.tsx       # 설정
│   │
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts # NextAuth
│   │   ├── creators/[username]/route.ts
│   │   ├── supports/route.ts
│   │   ├── payments/
│   │   │   ├── confirm/route.ts
│   │   │   └── webhook/route.ts
│   │   └── me/
│   │       ├── route.ts
│   │       ├── username/route.ts
│   │       ├── supports/
│   │       │   ├── route.ts
│   │       │   └── stats/route.ts
│   │       ├── payouts/route.ts
│   │       └── tools/route.ts
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                             # shadcn/ui 컴포넌트
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   ├── creator/
│   │   ├── creator-card.tsx
│   │   ├── support-form.tsx
│   │   ├── support-card.tsx
│   │   └── coffee-button.tsx
│   ├── dashboard/
│   │   ├── stat-card.tsx
│   │   ├── support-table.tsx
│   │   ├── payout-table.tsx
│   │   └── tools-code.tsx
│   └── common/
│       ├── loading.tsx
│       ├── error-state.tsx
│       └── empty-state.tsx
│
├── lib/
│   ├── prisma.ts                       # Prisma 클라이언트
│   ├── auth.ts                         # NextAuth 설정
│   ├── payment.ts                      # 토스페이먼츠 유틸
│   ├── email.ts                        # Resend 이메일
│   ├── utils.ts                        # 공통 유틸
│   └── validations/
│       ├── support.ts
│       └── profile.ts
│
├── hooks/
│   ├── use-support.ts
│   └── use-creator.ts
│
├── types/
│   ├── index.ts
│   └── api.ts
│
└── constants/
    ├── index.ts
    └── bank-codes.ts
```

---

## 핵심 파일 구현

### 1. 환경 변수 (.env.local)

```env
# App
NEXT_PUBLIC_APP_NAME="커피값좀"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Kakao OAuth
KAKAO_CLIENT_ID="..."
KAKAO_CLIENT_SECRET="..."

# 토스페이먼츠
NEXT_PUBLIC_TOSS_CLIENT_KEY="test_ck_..."
TOSS_SECRET_KEY="test_sk_..."

# Resend
RESEND_API_KEY="re_..."

# 상수
NEXT_PUBLIC_DEFAULT_COFFEE_PRICE=3000
PLATFORM_FEE_RATE=0.05
MIN_PAYOUT_AMOUNT=10000
```

### 2. 상수 정의 (constants/index.ts)

```typescript
// src/constants/index.ts

export const APP_NAME = '커피값좀';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://coffeeworth.kr';

export const DEFAULT_COFFEE_PRICE = 3000;
export const MIN_COFFEE_PRICE = 1000;
export const MAX_COFFEE_PRICE = 100000;

export const PLATFORM_FEE_RATE = 0.05; // 5%
export const MIN_PAYOUT_AMOUNT = 10000; // 최소 정산 금액

export const MAX_MESSAGE_LENGTH = 200;
export const MAX_BIO_LENGTH = 500;
export const MAX_NAME_LENGTH = 50;

export const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

export const COFFEE_PRESETS = [1, 3, 5] as const;
export const DEFAULT_COFFEE_EMOJI = '☕';
export const DEFAULT_THEME_COLOR = '#FFDD00';
```

### 3. Prisma 클라이언트 (lib/prisma.ts)

```typescript
// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 4. NextAuth 설정 (lib/auth.ts)

```typescript
// src/lib/auth.ts

import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import KakaoProvider from 'next-auth/providers/kakao';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = user.username;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
```

### 5. 유효성 검사 스키마 (lib/validations/support.ts)

```typescript
// src/lib/validations/support.ts

import { z } from 'zod';
import { MAX_MESSAGE_LENGTH } from '@/constants';

export const createSupportSchema = z.object({
  creatorUsername: z.string().min(1),
  coffeeCount: z.number().int().min(1).max(100),
  message: z.string().max(MAX_MESSAGE_LENGTH).optional(),
  supporterName: z.string().max(50).optional(),
  supporterEmail: z.string().email().optional(),
  isAnonymous: z.boolean().default(false),
});

export type CreateSupportInput = z.infer<typeof createSupportSchema>;
```

### 6. 후원 생성 API (api/supports/route.ts)

```typescript
// src/app/api/supports/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/prisma';
import { createSupportSchema } from '@/lib/validations/support';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createSupportSchema.parse(body);

    // 크리에이터 조회
    const creator = await prisma.user.findUnique({
      where: { username: data.creatorUsername },
      select: { id: true, name: true, coffeePrice: true },
    });

    if (!creator) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '크리에이터를 찾을 수 없습니다' } },
        { status: 404 }
      );
    }

    const amount = creator.coffeePrice * data.coffeeCount;
    const orderId = `ORD_${Date.now()}_${nanoid(8)}`;

    // Support 레코드 생성 (결제 전)
    await prisma.support.create({
      data: {
        creatorId: creator.id,
        coffeeCount: data.coffeeCount,
        unitPrice: creator.coffeePrice,
        amount,
        message: data.message,
        supporterName: data.supporterName,
        supporterEmail: data.supporterEmail,
        isAnonymous: data.isAnonymous,
        orderId,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        amount,
        orderName: `커피값좀 - ${creator.name}님에게 커피 ${data.coffeeCount}잔`,
      },
    });
  } catch (error) {
    console.error('Create support error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
```

### 7. 결제 승인 API (api/payments/confirm/route.ts)

```typescript
// src/app/api/payments/confirm/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { confirmPayment } from '@/lib/payment';
import { sendSupportNotification } from '@/lib/email';
import { PLATFORM_FEE_RATE } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // Support 조회
    const support = await prisma.support.findUnique({
      where: { orderId },
      include: { creator: true },
    });

    if (!support) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '주문을 찾을 수 없습니다' } },
        { status: 404 }
      );
    }

    // 금액 검증
    if (support.amount !== amount) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: '금액이 일치하지 않습니다' } },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 승인
    const paymentResult = await confirmPayment(paymentKey, orderId, amount);

    if (!paymentResult.success) {
      await prisma.support.update({
        where: { id: support.id },
        data: { status: 'FAILED' },
      });
      return NextResponse.json(
        { success: false, error: { code: 'PAYMENT_FAILED', message: paymentResult.message } },
        { status: 400 }
      );
    }

    // 수수료 계산
    const platformFee = Math.round(amount * PLATFORM_FEE_RATE);
    const pgFee = Math.round(amount * 0.028); // 약 2.8%
    const netAmount = amount - platformFee - pgFee;

    // Support 업데이트
    await prisma.support.update({
      where: { id: support.id },
      data: {
        paymentKey,
        paymentMethod: paymentResult.method,
        status: 'COMPLETED',
        paidAt: new Date(),
        platformFee,
        pgFee,
        netAmount,
      },
    });

    // 크리에이터에게 알림 이메일
    if (support.creator.emailNotify && support.creator.email) {
      await sendSupportNotification(support.creator.email, {
        creatorName: support.creator.name || support.creator.username,
        supporterName: support.isAnonymous ? '익명' : support.supporterName || '익명',
        coffeeCount: support.coffeeCount,
        amount: support.amount,
        message: support.message,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        supportId: support.id,
        redirectUrl: `/@${support.creator.username}/thanks?supportId=${support.id}`,
      },
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
```

### 8. 토스페이먼츠 유틸 (lib/payment.ts)

```typescript
// src/lib/payment.ts

const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments';

interface ConfirmPaymentResult {
  success: boolean;
  message?: string;
  method?: string;
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<ConfirmPaymentResult> {
  const secretKey = process.env.TOSS_SECRET_KEY!;
  const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

  try {
    const response = await fetch(`${TOSS_API_URL}/confirm`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || '결제 승인에 실패했습니다',
      };
    }

    return {
      success: true,
      method: data.method, // CARD, 카카오페이, 토스페이 등
    };
  } catch (error) {
    console.error('Toss payment confirm error:', error);
    return {
      success: false,
      message: '결제 승인 중 오류가 발생했습니다',
    };
  }
}
```

---

## 구현 체크리스트

### Week 1: 기반 구축
- [ ] Next.js 프로젝트 생성
- [ ] Tailwind + shadcn/ui 설정
- [ ] Prisma + Supabase 연결
- [ ] NextAuth + 카카오 로그인
- [ ] 기본 레이아웃 (헤더, 푸터)

### Week 2: 크리에이터 페이지
- [ ] 프로필 설정 페이지
- [ ] username 설정 & 중복 체크
- [ ] /@username 페이지
- [ ] 후원 폼 컴포넌트
- [ ] 커피 선택 버튼

### Week 3: 결제 연동
- [ ] 토스페이먼츠 SDK 연동
- [ ] 결제 요청 API
- [ ] 결제 승인 API
- [ ] 결제 완료 페이지
- [ ] 결제 웹훅 처리

### Week 4: 대시보드
- [ ] 대시보드 레이아웃
- [ ] 통계 카드
- [ ] 후원 내역 테이블
- [ ] 정산 페이지
- [ ] 연동 도구 (뱃지 코드)

### Week 5: 알림 & 폴리싱
- [ ] Resend 이메일 연동
- [ ] 후원 알림 이메일
- [ ] 로딩 상태
- [ ] 에러 처리
- [ ] 반응형 점검

### Week 6: 런칭
- [ ] 랜딩 페이지
- [ ] 도메인 연결
- [ ] 프로덕션 환경 변수
- [ ] 토스페이먼츠 라이브 전환
- [ ] 베타 테스트
