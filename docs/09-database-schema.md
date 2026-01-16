# 09. 데이터베이스 스키마

## 개요

| 항목 | 값 |
|------|-----|
| DBMS | PostgreSQL |
| ORM | Prisma |
| 호스팅 | Supabase |

## ERD

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Support   │       │   Payout    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │◄──────│ creatorId   │       │ id          │
│ email       │       │ supporterId │───────►│ userId      │
│ username    │       │ amount      │       │ totalAmount │
│ ...         │       │ message     │◄──────│ ...         │
└─────────────┘       │ payoutId    │───────►└─────────────┘
                      └─────────────┘
```

## 스키마 정의

### schema.prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ==========================================
// User (크리에이터 & 후원자)
// ==========================================
model User {
  id            String    @id @default(cuid())
  
  // 인증 정보
  email         String    @unique
  emailVerified DateTime?
  
  // 프로필 정보
  name          String?                      // 표시 이름
  username      String?   @unique            // URL용 (예: @username)
  image         String?                      // 프로필 이미지 URL
  bio           String?   @db.VarChar(500)   // 자기소개
  
  // 소셜 링크
  githubUrl     String?
  blogUrl       String?
  twitterUrl    String?
  
  // 후원 설정
  coffeePrice   Int       @default(3000)     // 커피 1잔 가격 (원)
  coffeeEmoji   String    @default("☕")     // 커피 이모지
  themeColor    String    @default("#FFDD00") // 테마 색상
  
  // 계좌 정보 (정산용)
  bankCode      String?                      // 은행 코드
  bankName      String?                      // 은행명
  bankAccount   String?                      // 계좌번호
  accountHolder String?                      // 예금주
  
  // 설정
  isPublic      Boolean   @default(true)     // 페이지 공개 여부
  emailNotify   Boolean   @default(true)     // 이메일 알림 여부
  
  // 관계
  accounts      Account[]
  sessions      Session[]
  supports      Support[] @relation("CreatorSupports")  // 받은 후원
  given         Support[] @relation("SupporterSupports") // 한 후원
  payouts       Payout[]
  
  // 타임스탬프
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([username])
  @@index([email])
}

// ==========================================
// NextAuth 관련 테이블
// ==========================================
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}

// ==========================================
// Support (후원)
// ==========================================
model Support {
  id            String   @id @default(cuid())
  
  // 크리에이터 (후원 받는 사람)
  creatorId     String
  creator       User     @relation("CreatorSupports", fields: [creatorId], references: [id])
  
  // 후원자 (회원일 경우)
  supporterId   String?
  supporter     User?    @relation("SupporterSupports", fields: [supporterId], references: [id])
  
  // 후원자 정보 (비회원 또는 익명)
  supporterName String?                      // 표시할 이름
  supporterEmail String?                     // 이메일 (영수증 발송용)
  isAnonymous   Boolean  @default(false)     // 익명 여부
  
  // 후원 내용
  coffeeCount   Int                          // 커피 개수
  unitPrice     Int                          // 커피 1잔 가격 (후원 시점)
  amount        Int                          // 총 후원 금액
  message       String?  @db.VarChar(200)    // 응원 메시지
  
  // 결제 정보
  orderId       String   @unique             // 주문 ID (우리 시스템)
  paymentKey    String?  @unique             // 토스페이먼츠 결제 키
  paymentMethod String?                      // 결제 수단 (kakao, toss, card)
  
  // 상태
  status        SupportStatus @default(PENDING)
  
  // 수수료 (정산 시 계산)
  platformFee   Int?                         // 플랫폼 수수료
  pgFee         Int?                         // PG 수수료
  netAmount     Int?                         // 실 정산액
  
  // 정산 연결
  payoutId      String?
  payout        Payout?  @relation(fields: [payoutId], references: [id])
  
  // 타임스탬프
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  paidAt        DateTime?                    // 결제 완료 시각
  
  @@index([creatorId])
  @@index([supporterId])
  @@index([status])
  @@index([createdAt])
  @@index([payoutId])
}

enum SupportStatus {
  PENDING     // 결제 대기
  COMPLETED   // 결제 완료
  FAILED      // 결제 실패
  REFUNDED    // 환불됨
  SETTLED     // 정산 완료
}

// ==========================================
// Payout (정산)
// ==========================================
model Payout {
  id            String   @id @default(cuid())
  
  // 크리에이터
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  
  // 정산 금액
  totalAmount   Int                          // 총 후원액
  platformFee   Int                          // 플랫폼 수수료 합계
  pgFee         Int                          // PG 수수료 합계
  netAmount     Int                          // 실 정산액
  
  // 계좌 정보 (정산 시점 스냅샷)
  bankCode      String
  bankName      String
  bankAccount   String
  accountHolder String
  
  // 상태
  status        PayoutStatus @default(PENDING)
  
  // 포함된 후원
  supports      Support[]
  supportCount  Int                          // 후원 건수
  
  // 처리 정보
  processedAt   DateTime?                    // 처리 시각
  transferredAt DateTime?                    // 송금 완료 시각
  failReason    String?                      // 실패 사유
  
  // 타임스탬프
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

enum PayoutStatus {
  PENDING     // 정산 대기
  PROCESSING  // 처리 중
  COMPLETED   // 완료
  FAILED      // 실패
}
```

---

## 테이블 상세

### User 테이블

| 컬럼 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| id | String | O | cuid() | PK |
| email | String | O | - | 이메일 (unique) |
| username | String | X | - | URL용 ID (unique) |
| name | String | X | - | 표시 이름 |
| image | String | X | - | 프로필 이미지 URL |
| bio | String(500) | X | - | 자기소개 |
| githubUrl | String | X | - | GitHub URL |
| blogUrl | String | X | - | 블로그 URL |
| twitterUrl | String | X | - | 트위터 URL |
| coffeePrice | Int | O | 3000 | 커피 1잔 가격 |
| coffeeEmoji | String | O | "☕" | 커피 이모지 |
| themeColor | String | O | "#FFDD00" | 테마 색상 |
| bankCode | String | X | - | 은행 코드 |
| bankName | String | X | - | 은행명 |
| bankAccount | String | X | - | 계좌번호 |
| accountHolder | String | X | - | 예금주 |

### Support 테이블

| 컬럼 | 타입 | 필수 | 설명 |
|------|------|------|------|
| id | String | O | PK |
| creatorId | String | O | 크리에이터 FK |
| supporterId | String | X | 후원자 FK (회원) |
| supporterName | String | X | 후원자 이름 |
| supporterEmail | String | X | 후원자 이메일 |
| isAnonymous | Boolean | O | 익명 여부 |
| coffeeCount | Int | O | 커피 개수 |
| unitPrice | Int | O | 커피 단가 |
| amount | Int | O | 총 금액 |
| message | String(200) | X | 응원 메시지 |
| orderId | String | O | 주문 ID |
| paymentKey | String | X | 토스 결제 키 |
| paymentMethod | String | X | 결제 수단 |
| status | Enum | O | 상태 |

### Payout 테이블

| 컬럼 | 타입 | 필수 | 설명 |
|------|------|------|------|
| id | String | O | PK |
| userId | String | O | 크리에이터 FK |
| totalAmount | Int | O | 총 후원액 |
| platformFee | Int | O | 플랫폼 수수료 |
| pgFee | Int | O | PG 수수료 |
| netAmount | Int | O | 실 정산액 |
| status | Enum | O | 상태 |
| supportCount | Int | O | 후원 건수 |

---

## 은행 코드

```typescript
// lib/constants/bank-codes.ts

export const BANK_CODES = {
  '004': 'KB국민은행',
  '088': '신한은행',
  '020': '우리은행',
  '081': '하나은행',
  '011': 'NH농협은행',
  '003': 'IBK기업은행',
  '023': 'SC제일은행',
  '027': '씨티은행',
  '039': '경남은행',
  '034': '광주은행',
  '031': '대구은행',
  '032': '부산은행',
  '045': '새마을금고',
  '064': '산림조합중앙회',
  '048': '신협',
  '071': '우체국',
  '037': '전북은행',
  '035': '제주은행',
  '090': '카카오뱅크',
  '092': '토스뱅크',
  '089': '케이뱅크',
} as const;

export type BankCode = keyof typeof BANK_CODES;
```

---

## 인덱스 전략

### 주요 쿼리 패턴

| 쿼리 | 인덱스 |
|------|--------|
| 유저명으로 크리에이터 조회 | `User.username` |
| 크리에이터의 후원 목록 | `Support.creatorId` + `Support.createdAt` |
| 정산 대기 후원 조회 | `Support.status` + `Support.payoutId` |
| 사용자 정산 내역 | `Payout.userId` + `Payout.createdAt` |

---

## 마이그레이션 명령어

```bash
# 스키마 변경 후 마이그레이션 생성
npx prisma migrate dev --name <migration_name>

# 프로덕션 마이그레이션 적용
npx prisma migrate deploy

# Prisma Client 재생성
npx prisma generate

# DB 스키마 시각화
npx prisma studio
```
