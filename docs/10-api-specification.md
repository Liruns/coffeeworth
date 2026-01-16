# 10. API 명세

## 개요

| 항목 | 값 |
|------|-----|
| Base URL | `https://coffeeworth.kr/api` |
| 인증 | NextAuth.js Session |
| 포맷 | JSON |

## 응답 형식

### 성공 응답
```typescript
{
  "success": true,
  "data": { ... }
}
```

### 에러 응답
```typescript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

### 에러 코드
| 코드 | HTTP | 설명 |
|------|------|------|
| UNAUTHORIZED | 401 | 인증 필요 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스 없음 |
| VALIDATION_ERROR | 400 | 유효성 검사 실패 |
| PAYMENT_FAILED | 400 | 결제 실패 |
| INTERNAL_ERROR | 500 | 서버 에러 |

---

## Public API

### GET /api/creators/[username]

크리에이터 공개 정보 조회

**Request**
```
GET /api/creators/johndoe
```

**Response**
```typescript
{
  "success": true,
  "data": {
    "id": "clx...",
    "username": "johndoe",
    "name": "김개발",
    "image": "https://...",
    "bio": "풀스택 개발자입니다.",
    "githubUrl": "https://github.com/johndoe",
    "blogUrl": "https://johndoe.dev",
    "twitterUrl": null,
    "coffeePrice": 3000,
    "coffeeEmoji": "☕",
    "themeColor": "#FFDD00",
    "recentSupports": [
      {
        "supporterName": "익명",
        "coffeeCount": 1,
        "message": "좋은 글 감사합니다!",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "totalSupporters": 45,
    "totalCoffees": 120
  }
}
```

**에러**
| 코드 | 상황 |
|------|------|
| NOT_FOUND | 존재하지 않는 username |

---

### POST /api/supports

후원 생성 (결제 전)

**Request**
```typescript
POST /api/supports
Content-Type: application/json

{
  "creatorUsername": "johndoe",
  "coffeeCount": 3,
  "message": "좋은 글 감사합니다!",      // optional, max 200
  "supporterName": "서준",               // optional
  "supporterEmail": "user@email.com",   // optional
  "isAnonymous": false                   // optional, default false
}
```

**Response**
```typescript
{
  "success": true,
  "data": {
    "orderId": "ORD_20240115_abc123",
    "amount": 9000,
    "orderName": "커피값좀 - 김개발님에게 커피 3잔"
  }
}
```

**에러**
| 코드 | 상황 |
|------|------|
| NOT_FOUND | 존재하지 않는 크리에이터 |
| VALIDATION_ERROR | coffeeCount가 1 미만 |

---

### POST /api/payments/confirm

결제 승인 (토스페이먼츠 콜백)

**Request**
```typescript
POST /api/payments/confirm
Content-Type: application/json

{
  "paymentKey": "toss_payment_key",
  "orderId": "ORD_20240115_abc123",
  "amount": 9000
}
```

**Response**
```typescript
{
  "success": true,
  "data": {
    "supportId": "clx...",
    "redirectUrl": "/@johndoe/thanks?supportId=clx..."
  }
}
```

**에러**
| 코드 | 상황 |
|------|------|
| NOT_FOUND | 존재하지 않는 orderId |
| PAYMENT_FAILED | 결제 승인 실패 |
| VALIDATION_ERROR | 금액 불일치 |

---

### POST /api/payments/webhook

토스페이먼츠 웹훅 (자동 호출)

**Request** (토스페이먼츠에서 호출)
```typescript
POST /api/payments/webhook
Content-Type: application/json

{
  "eventType": "PAYMENT_STATUS_CHANGED",
  "data": {
    "paymentKey": "...",
    "orderId": "...",
    "status": "DONE"
  }
}
```

**Response**
```typescript
{
  "success": true
}
```

---

## Authenticated API (크리에이터)

> 모든 요청에 NextAuth 세션 필요

### GET /api/me

내 정보 조회

**Response**
```typescript
{
  "success": true,
  "data": {
    "id": "clx...",
    "email": "me@email.com",
    "username": "johndoe",
    "name": "김개발",
    "image": "https://...",
    "bio": "풀스택 개발자입니다.",
    "githubUrl": "https://github.com/johndoe",
    "blogUrl": "https://johndoe.dev",
    "twitterUrl": null,
    "coffeePrice": 3000,
    "coffeeEmoji": "☕",
    "themeColor": "#FFDD00",
    "bankCode": "090",
    "bankName": "카카오뱅크",
    "bankAccount": "3333-12-3456789",
    "accountHolder": "김개발",
    "isPublic": true,
    "emailNotify": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### PATCH /api/me

내 정보 수정

**Request**
```typescript
PATCH /api/me
Content-Type: application/json

{
  "name": "김개발",
  "bio": "새로운 소개글",
  "coffeePrice": 5000,
  // ... 수정할 필드만
}
```

**Validation**
| 필드 | 규칙 |
|------|------|
| username | 3-20자, 영문소문자/숫자/언더스코어 |
| name | 1-50자 |
| bio | 최대 500자 |
| coffeePrice | 1000-100000 |
| themeColor | HEX 색상 코드 |

**Response**
```typescript
{
  "success": true,
  "data": { ... } // 업데이트된 정보
}
```

---

### PATCH /api/me/username

username 변경 (별도 API)

**Request**
```typescript
PATCH /api/me/username
Content-Type: application/json

{
  "username": "newusername"
}
```

**Response**
```typescript
{
  "success": true,
  "data": {
    "username": "newusername"
  }
}
```

**에러**
| 코드 | 상황 |
|------|------|
| VALIDATION_ERROR | 형식 불일치 |
| CONFLICT | 이미 사용 중인 username |

---

### GET /api/me/supports

받은 후원 목록

**Request**
```
GET /api/me/supports?page=1&limit=20&status=COMPLETED
```

**Query Parameters**
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| page | number | 1 | 페이지 |
| limit | number | 20 | 페이지당 개수 (max 100) |
| status | string | - | 필터 (COMPLETED, SETTLED) |
| from | string | - | 시작일 (YYYY-MM-DD) |
| to | string | - | 종료일 (YYYY-MM-DD) |

**Response**
```typescript
{
  "success": true,
  "data": {
    "supports": [
      {
        "id": "clx...",
        "supporterName": "서준",
        "isAnonymous": false,
        "coffeeCount": 3,
        "amount": 9000,
        "message": "좋은 글 감사합니다!",
        "paymentMethod": "kakao",
        "status": "COMPLETED",
        "createdAt": "2024-01-15T10:30:00Z",
        "paidAt": "2024-01-15T10:31:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    },
    "summary": {
      "totalAmount": 450000,
      "totalCoffees": 150,
      "totalSupporters": 45
    }
  }
}
```

---

### GET /api/me/supports/stats

후원 통계

**Request**
```
GET /api/me/supports/stats?period=month
```

**Query Parameters**
| 파라미터 | 값 | 설명 |
|----------|-----|------|
| period | week | 최근 7일 |
| period | month | 최근 30일 |
| period | year | 최근 365일 |
| period | all | 전체 |

**Response**
```typescript
{
  "success": true,
  "data": {
    "period": "month",
    "totalAmount": 150000,
    "totalCoffees": 50,
    "totalSupporters": 25,
    "avgAmount": 6000,
    "byDate": [
      { "date": "2024-01-15", "amount": 9000, "count": 3 },
      { "date": "2024-01-14", "amount": 15000, "count": 5 }
    ]
  }
}
```

---

### GET /api/me/payouts

정산 내역

**Response**
```typescript
{
  "success": true,
  "data": {
    "payouts": [
      {
        "id": "clx...",
        "totalAmount": 100000,
        "platformFee": 5000,
        "pgFee": 2800,
        "netAmount": 92200,
        "supportCount": 15,
        "status": "COMPLETED",
        "bankName": "카카오뱅크",
        "bankAccount": "3333-**-****789",
        "createdAt": "2024-01-12T00:00:00Z",
        "transferredAt": "2024-01-12T14:00:00Z"
      }
    ],
    "pendingAmount": 45000,  // 정산 대기 금액
    "pendingCount": 8        // 정산 대기 건수
  }
}
```

---

### POST /api/me/payouts

정산 신청

**Request**
```typescript
POST /api/me/payouts
Content-Type: application/json

{} // 별도 파라미터 없음
```

**Response**
```typescript
{
  "success": true,
  "data": {
    "id": "clx...",
    "netAmount": 92200,
    "supportCount": 15,
    "status": "PENDING"
  }
}
```

**에러**
| 코드 | 상황 |
|------|------|
| VALIDATION_ERROR | 최소 금액(10,000원) 미달 |
| VALIDATION_ERROR | 계좌 정보 미등록 |
| CONFLICT | 이미 처리 중인 정산 있음 |

---

### GET /api/me/tools

연동 도구 코드 생성

**Response**
```typescript
{
  "success": true,
  "data": {
    "pageUrl": "https://coffeeworth.kr/@johndoe",
    "badges": {
      "markdown": "[![커피값좀](https://coffeeworth.kr/badge/johndoe)](https://coffeeworth.kr/@johndoe)",
      "html": "<a href=\"https://coffeeworth.kr/@johndoe\"><img src=\"https://coffeeworth.kr/badge/johndoe\" alt=\"커피값좀\" /></a>"
    },
    "widget": {
      "small": "<iframe src=\"https://coffeeworth.kr/widget/johndoe?size=small\" ... />",
      "medium": "<iframe src=\"https://coffeeworth.kr/widget/johndoe?size=medium\" ... />"
    }
  }
}
```

---

## API 타입 정의

```typescript
// types/api.ts

// 공통 응답
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// 페이지네이션
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 후원 생성 요청
export interface CreateSupportRequest {
  creatorUsername: string;
  coffeeCount: number;
  message?: string;
  supporterName?: string;
  supporterEmail?: string;
  isAnonymous?: boolean;
}

// 후원 생성 응답
export interface CreateSupportResponse {
  orderId: string;
  amount: number;
  orderName: string;
}

// 결제 승인 요청
export interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

// 프로필 수정 요청
export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  githubUrl?: string;
  blogUrl?: string;
  twitterUrl?: string;
  coffeePrice?: number;
  coffeeEmoji?: string;
  themeColor?: string;
  bankCode?: string;
  bankAccount?: string;
  accountHolder?: string;
  isPublic?: boolean;
  emailNotify?: boolean;
}
```
