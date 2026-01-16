# 기술 스택

## 개요

> 1인 개발, 빠른 개발, 낮은 운영 비용을 고려한 기술 스택

## 스택 선정

### Frontend

| 기술 | 선택 | 이유 |
|------|------|------|
| Framework | **Next.js 14+** | App Router, SSR, API Routes |
| Styling | **Tailwind CSS** | 빠른 개발, 유틸리티 |
| UI Components | **shadcn/ui** | 커스터마이징 용이, 복사-붙여넣기 |
| State | **Zustand** or **React Query** | 간단한 상태 관리 |
| Form | **React Hook Form** + **Zod** | 폼 검증 |

### Backend

| 기술 | 선택 | 이유 |
|------|------|------|
| Runtime | **Next.js API Routes** | 프론트와 통합, 별도 서버 불필요 |
| ORM | **Prisma** | Type-safe, 마이그레이션 |
| Database | **PostgreSQL (Supabase)** | 관리형, 무료 티어 |

### Infrastructure

| 기술 | 선택 | 이유 |
|------|------|------|
| Hosting | **Vercel** | Next.js 최적화, 무료 티어 |
| Database | **Supabase** | PostgreSQL 관리형 |
| Storage | **Supabase Storage** or **Cloudflare R2** | 이미지 저장 |
| Email | **Resend** | 개발자 친화적, 저렴 |

### Payment

| 기술 | 선택 | 이유 |
|------|------|------|
| PG | **토스페이먼츠** | 카카오페이/토스 지원, 문서 좋음 |
| 대안 | **포트원 (구 아임포트)** | 여러 PG 통합 |

### Auth

| 기술 | 선택 | 이유 |
|------|------|------|
| Auth | **NextAuth.js (Auth.js)** | Next.js 통합, OAuth 지원 |
| Providers | Kakao, Google, Email | 카카오 우선 |

---

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                               │
│                    (Next.js Frontend)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                       │
│                      (CDN, SSL)                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js API Routes                         │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   Auth   │  │ Payment  │  │  Creator │  │ Payout   │    │
│  │   API    │  │   API    │  │   API    │  │   API    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Supabase   │ │ 토스페이먼츠  │ │    Resend    │
│  PostgreSQL  │ │   Payment    │ │    Email     │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 데이터베이스 스키마 (초안)

```prisma
// schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  username      String    @unique
  image         String?
  bio           String?
  
  // 소셜 링크
  githubUrl     String?
  blogUrl       String?
  twitterUrl    String?
  
  // 설정
  coffeePrice   Int       @default(3000)
  themeColor    String    @default("#FFDD00")
  
  // 계좌 정보
  bankName      String?
  bankAccount   String?
  accountHolder String?
  
  // 관계
  supports      Support[] @relation("creator")
  given         Support[] @relation("supporter")
  payouts       Payout[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Support {
  id            String    @id @default(cuid())
  
  // 크리에이터
  creatorId     String
  creator       User      @relation("creator", fields: [creatorId], references: [id])
  
  // 후원자 (비회원 가능)
  supporterId   String?
  supporter     User?     @relation("supporter", fields: [supporterId], references: [id])
  supporterName String?   // 비회원용
  isAnonymous   Boolean   @default(false)
  
  // 후원 정보
  amount        Int       // 후원 금액
  coffeeCount   Int       // 커피 개수
  message       String?   // 응원 메시지
  
  // 결제 정보
  paymentId     String    @unique
  paymentMethod String    // kakao, toss, card
  status        String    @default("pending") // pending, completed, failed, refunded
  
  // 정산
  payoutId      String?
  payout        Payout?   @relation(fields: [payoutId], references: [id])
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Payout {
  id            String    @id @default(cuid())
  
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  
  // 정산 금액
  totalAmount   Int       // 총 후원액
  platformFee   Int       // 플랫폼 수수료 (5%)
  pgFee         Int       // PG 수수료
  netAmount     Int       // 실 정산액
  
  // 계좌 정보 (정산 시점 스냅샷)
  bankName      String
  bankAccount   String
  accountHolder String
  
  // 상태
  status        String    @default("pending") // pending, processing, completed, failed
  
  // 정산 포함 후원
  supports      Support[]
  
  processedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

---

## API 엔드포인트

### Public

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/creators/:username | 크리에이터 정보 |
| POST | /api/support | 후원 생성 |
| POST | /api/payment/webhook | 결제 웹훅 |

### Authenticated (크리에이터)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/me | 내 정보 |
| PATCH | /api/me | 정보 수정 |
| GET | /api/me/supports | 받은 후원 목록 |
| GET | /api/me/payouts | 정산 내역 |
| POST | /api/me/payouts | 정산 신청 |

---

## 결제 플로우 (토스페이먼츠)

```
1. [클라이언트] 후원 정보 입력
2. [클라이언트] POST /api/support → 주문 생성
3. [서버] Support 레코드 생성 (status: pending)
4. [클라이언트] 토스페이먼츠 SDK로 결제창 호출
5. [토스] 결제 진행
6. [토스] 결제 완료 → 리다이렉트 + 웹훅
7. [서버] POST /api/payment/webhook
8. [서버] 결제 검증 → Support 상태 업데이트 (status: completed)
9. [서버] 크리에이터에게 알림 이메일
10. [클라이언트] 완료 페이지 표시
```

---

## 폴더 구조

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # 랜딩
│   │   ├── [username]/
│   │   │   ├── page.tsx          # 크리에이터 페이지
│   │   │   └── thanks/page.tsx   # 완료 페이지
│   │   └── login/page.tsx        # 로그인
│   │
│   ├── dashboard/
│   │   ├── page.tsx              # 대시보드 홈
│   │   ├── supporters/page.tsx   # 후원 내역
│   │   ├── payouts/page.tsx      # 정산
│   │   ├── tools/page.tsx        # 연동 도구
│   │   └── settings/page.tsx     # 설정
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── creators/[username]/route.ts
│       ├── support/route.ts
│       ├── payment/webhook/route.ts
│       └── me/
│           ├── route.ts
│           ├── supports/route.ts
│           └── payouts/route.ts
│
├── components/
│   ├── ui/                       # shadcn/ui
│   ├── creator-page/
│   ├── dashboard/
│   └── common/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── payment.ts
│   └── email.ts
│
├── prisma/
│   └── schema.prisma
│
└── public/
    └── images/
```

---

## 환경 변수

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="https://..."
NEXTAUTH_SECRET="..."
KAKAO_CLIENT_ID="..."
KAKAO_CLIENT_SECRET="..."

# Payment (토스페이먼츠)
TOSS_CLIENT_KEY="..."
TOSS_SECRET_KEY="..."

# Email
RESEND_API_KEY="..."

# App
NEXT_PUBLIC_APP_URL="https://..."
```

---

## 비용 예측 (월)

### 무료 티어로 시작

| 서비스 | 플랜 | 비용 |
|--------|------|------|
| Vercel | Hobby | $0 |
| Supabase | Free | $0 |
| Resend | Free (3,000건) | $0 |
| **합계** | | **$0** |

### 성장 시 (Pro 플랜)

| 서비스 | 플랜 | 비용 |
|--------|------|------|
| Vercel | Pro | $20/월 |
| Supabase | Pro | $25/월 |
| Resend | Pro | $20/월 |
| **합계** | | **~$65/월** |
