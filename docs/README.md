# 커피값좀 (coffeeworth) - 기획 문서

> 한국 개발자와 블로거를 위한 후원 플랫폼

## 서비스 정보

| 항목 | 값 |
|------|-----|
| **서비스명** | 커피값좀 |
| **영문명** | coffeeworth |
| **도메인 후보** | coffeeworth.kr, coffeeworth.co.kr |
| **슬로건** | "당신의 콘텐츠에 커피값좀 보태드릴게요" |

## 문서 구조

```
docs/
├── README.md                    # 이 문서
├── 01-overview.md               # 서비스 개요
├── 02-target-persona.md         # 타겟 페르소나
├── 03-competitive-analysis.md   # 경쟁 분석
├── 04-features.md               # 기능 정의
├── 05-user-flow.md              # 사용자 플로우
├── 06-business-model.md         # 비즈니스 모델
├── 07-tech-stack.md             # 기술 스택
├── 08-roadmap.md                # 개발 로드맵
├── 09-database-schema.md        # DB 스키마 상세
├── 10-api-specification.md      # API 명세
├── 11-ui-specification.md       # UI 컴포넌트 명세
└── 12-implementation-guide.md   # 구현 가이드 (AI Agent용)
```

## AI Agent 구현 가이드

이 문서는 AI Agent가 코드를 생성할 때 참고할 수 있도록 작성되었습니다.

### 구현 순서

```
1. 프로젝트 초기화 (12-implementation-guide.md 참고)
2. DB 스키마 생성 (09-database-schema.md)
3. API 구현 (10-api-specification.md)
4. UI 구현 (11-ui-specification.md)
5. 결제 연동 (07-tech-stack.md)
```

### 핵심 제약사항

- **서비스명**: 커피값좀 (coffeeworth)
- **기본 커피 가격**: 3,000원
- **수수료**: 5%
- **결제**: 토스페이먼츠 (카카오페이, 토스페이)
- **정산**: 주 1회 (금요일), 최소 10,000원

## Quick Reference

### 환경 변수
```env
NEXT_PUBLIC_APP_NAME="커피값좀"
NEXT_PUBLIC_APP_URL="https://coffeeworth.kr"
NEXT_PUBLIC_DEFAULT_COFFEE_PRICE=3000
PLATFORM_FEE_RATE=0.05
```

### URL 구조
| URL | 설명 |
|-----|------|
| `/` | 랜딩 페이지 |
| `/login` | 로그인 |
| `/@{username}` | 크리에이터 페이지 |
| `/@{username}/thanks` | 후원 완료 |
| `/dashboard` | 대시보드 홈 |
| `/dashboard/supporters` | 후원 내역 |
| `/dashboard/payouts` | 정산 |
| `/dashboard/tools` | 연동 도구 |
| `/dashboard/settings` | 설정 |

### 주요 상수
```typescript
const CONSTANTS = {
  APP_NAME: '커피값좀',
  DEFAULT_COFFEE_PRICE: 3000,
  MIN_PAYOUT_AMOUNT: 10000,
  PLATFORM_FEE_RATE: 0.05,
  PAYOUT_DAY: 5, // 금요일 (0=일, 5=금)
  MAX_MESSAGE_LENGTH: 200,
  MAX_BIO_LENGTH: 500,
} as const;
```
