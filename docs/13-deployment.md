# 13. 배포 및 인프라 가이드

## 인프라 구성도

```
┌─────────────────────────────────────────────────────────────────┐
│                         사용자                                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare (DNS + CDN)                        │
│                    coffeeworth.kr                                │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel                                   │
│                   (Next.js 호스팅)                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Edge Network (글로벌 CDN)                                  │ │
│  │  - 서울 리전 우선                                          │ │
│  │  - 자동 HTTPS                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Serverless Functions                                       │ │
│  │  - API Routes                                               │ │
│  │  - Edge Functions (결제 콜백)                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│     Supabase     │ │   토스페이먼츠    │ │      Resend      │
│   (PostgreSQL)   │ │    (결제 PG)     │ │     (이메일)     │
│   싱가포르 리전   │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
          │
          ▼
┌──────────────────┐
│ Supabase Storage │
│  (이미지 저장)   │
└──────────────────┘
```

---

## 서비스별 설정

### 1. Vercel (메인 호스팅)

#### 계정 및 플랜
| 항목 | 값 |
|------|-----|
| 플랜 | Hobby (무료) → Pro ($20/월) |
| 리전 | sin1 (싱가포르) - 한국에서 가장 빠름 |
| Framework | Next.js (자동 감지) |

#### 프로젝트 설정
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 연결
vercel link

# 환경 변수 설정
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... 모든 환경 변수

# 배포
vercel --prod
```

#### vercel.json
```json
{
  "framework": "nextjs",
  "regions": ["sin1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

#### 환경 변수 (Vercel Dashboard)
```
# Production
NEXT_PUBLIC_APP_URL=https://coffeeworth.kr
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXTAUTH_URL=https://coffeeworth.kr
NEXTAUTH_SECRET=...
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_...
TOSS_SECRET_KEY=live_sk_...
RESEND_API_KEY=re_...

# Preview (테스트용)
NEXT_PUBLIC_APP_URL=https://coffeeworth-preview.vercel.app
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...
```

---

### 2. Supabase (데이터베이스)

#### 프로젝트 설정
| 항목 | 값 |
|------|-----|
| 플랜 | Free → Pro ($25/월) |
| 리전 | ap-southeast-1 (싱가포르) |
| PostgreSQL 버전 | 15 |

#### 연결 설정
```env
# Pooled Connection (서버리스용)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (마이그레이션용)
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

#### Prisma 설정
```prisma
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

#### 마이그레이션
```bash
# 개발 환경
npx prisma migrate dev --name init

# 프로덕션
npx prisma migrate deploy
```

---

### 3. Cloudflare (도메인 + CDN)

#### 도메인 설정
```
coffeeworth.kr → Cloudflare DNS
```

#### DNS 레코드
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | @ | cname.vercel-dns.com | ON |
| CNAME | www | cname.vercel-dns.com | ON |

#### SSL 설정
- SSL/TLS: Full (strict)
- Always Use HTTPS: ON
- Automatic HTTPS Rewrites: ON

#### 캐싱 설정
- Browser Cache TTL: 4 hours
- Edge Cache TTL: 2 hours (API는 제외)

---

### 4. 토스페이먼츠 (결제)

#### 계정 설정
| 환경 | Client Key | Secret Key |
|------|------------|------------|
| 테스트 | test_ck_... | test_sk_... |
| 라이브 | live_ck_... | live_sk_... |

#### 웹훅 설정
```
웹훅 URL: https://coffeeworth.kr/api/payments/webhook
이벤트: PAYMENT_STATUS_CHANGED
```

#### 결제 수단
| 수단 | 활성화 | 비고 |
|------|--------|------|
| 카카오페이 | ✅ | 국내 필수 |
| 토스페이 | ✅ | 국내 필수 |
| 신용카드 | ✅ | 국내 + 해외 |
| PayPal | ✅ | 해외 결제용 |

---

### 5. Resend (이메일)

#### 설정
```
API Key: re_...
From: noreply@coffeeworth.kr
```

#### DNS 레코드 (이메일 인증)
| Type | Name | Content |
|------|------|---------|
| TXT | resend._domainkey | v=DKIM1; k=rsa; p=... |
| TXT | @ | v=spf1 include:_spf.resend.com ~all |

---

## 배포 프로세스

### 개발 워크플로우

```
main (프로덕션)
  │
  ├── develop (개발)
  │     │
  │     ├── feature/xxx (기능 개발)
  │     │
  │     └── fix/xxx (버그 수정)
```

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy-preview:
    needs: lint-and-test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 배포 체크리스트

#### 첫 배포 전
- [ ] 도메인 구매 (coffeeworth.kr)
- [ ] Cloudflare 계정 생성 및 도메인 연결
- [ ] Vercel 계정 생성 및 프로젝트 생성
- [ ] Supabase 프로젝트 생성
- [ ] 토스페이먼츠 가맹점 등록
- [ ] Resend 계정 생성 및 도메인 인증

#### 매 배포 시
- [ ] 로컬 테스트 완료
- [ ] 린트/타입 체크 통과
- [ ] Preview 배포 확인
- [ ] 프로덕션 배포
- [ ] 스모크 테스트

---

## 모니터링

### Vercel Analytics
- 페이지 성능 측정
- Core Web Vitals
- 트래픽 분석

### Sentry (에러 추적)
```bash
npm install @sentry/nextjs

npx @sentry/wizard@latest -i nextjs
```

### Uptime 모니터링
- Better Uptime (무료)
- 5분마다 헬스체크
- 다운타임 시 Slack 알림

---

## 비용 예측

### 무료 티어 (초기)
| 서비스 | 플랜 | 비용 |
|--------|------|------|
| Vercel | Hobby | $0 |
| Supabase | Free | $0 |
| Cloudflare | Free | $0 |
| Resend | Free (3K/월) | $0 |
| **합계** | | **$0** |

### 성장 시 (월 1만 방문 이상)
| 서비스 | 플랜 | 비용 |
|--------|------|------|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| Cloudflare | Free | $0 |
| Resend | Pro | $20 |
| Sentry | Team | $26 |
| **합계** | | **~$90/월** |

---

## 글로벌 결제 (해외 후원자)

### 지원 결제 수단
| 결제 수단 | 대상 | 설정 |
|-----------|------|------|
| 카카오페이 | 국내 | 기본 |
| 토스페이 | 국내 | 기본 |
| 신용카드 | 국내+해외 | 해외카드 허용 |
| PayPal | 해외 | 추가 연동 필요 |

### 다중 통화 지원
```typescript
// 통화별 최소 금액
const MIN_AMOUNTS = {
  KRW: 1000,
  USD: 1,
  EUR: 1,
  JPY: 100,
} as const;

// 커피 가격 (USD 기준 환산)
const COFFEE_PRICES = {
  KRW: 3000,   // 기본
  USD: 3,      // ~$3
  EUR: 3,      // ~€3
  JPY: 500,    // ~¥500
} as const;
```

### 정산
- 해외 결제: 원화로 환산하여 정산
- 환율: 결제 시점 기준
- 수수료: 동일 (5%)
