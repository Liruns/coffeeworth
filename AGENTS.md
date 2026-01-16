# AGENTS.md - AI Agent 작업 지침서

> 이 문서는 AI Agent가 "커피값좀" 프로젝트를 구현할 때 따라야 하는 지침입니다.

## 프로젝트 정보

| 항목 | 값 |
|------|-----|
| 서비스명 | **커피값좀** |
| 영문명 | coffeeworth |
| 설명 | 한국 개발자와 블로거를 위한 후원 플랫폼 |

## 핵심 원칙

### 1. 문서 우선
- 구현 전 반드시 `docs/` 폴더의 문서를 먼저 읽어라
- 특히 `12-implementation-guide.md`를 따라라
- 문서와 코드가 충돌하면 문서를 우선하라

### 2. 상수 사용
```typescript
// 하드코딩 금지
❌ const price = 3000;
✅ import { DEFAULT_COFFEE_PRICE } from '@/constants';

// 서비스명
❌ "Buy Me a Coffee"
✅ "커피값좀" 또는 APP_NAME
```

### 3. 한국어 우선
- UI 텍스트는 모두 한국어
- 에러 메시지도 한국어
- 코드 주석은 영어 또는 한국어 일관되게

### 4. 디자인 시스템 준수
- **UI 작업 전 반드시 `docs/14-design-system.md` 읽기**
- 브랜드 컬러: `#FFDD00` (Primary), `#6F4E37` (Coffee Brown)
- shadcn/ui 컴포넌트 기반, Tailwind CSS 사용
- 버튼/카드/입력 필드 스타일 가이드 준수

```typescript
// ❌ 임의 색상 사용
<Button className="bg-blue-500">

// ✅ 브랜드 컬러 사용
<Button className="bg-[#FFDD00] text-black hover:bg-[#E5C700]">
```

---

## 기술 스택 (변경 금지)

```yaml
프론트엔드:
  - Next.js 14+ (App Router)
  - TypeScript (strict mode)
  - Tailwind CSS
  - shadcn/ui

백엔드:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL (Supabase)

인증:
  - NextAuth.js
  - Kakao OAuth (필수)

결제:
  - 토스페이먼츠

이메일:
  - Resend
```

---

## 파일 구조 규칙

### 디렉토리 구조
```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # 공개 페이지 (인증 불필요)
│   ├── (dashboard)/       # 대시보드 (인증 필요)
│   └── api/               # API Routes
├── components/
│   ├── ui/                # shadcn/ui (수정 금지)
│   └── [feature]/         # 기능별 컴포넌트
├── lib/                   # 유틸리티
├── hooks/                 # Custom Hooks
├── types/                 # TypeScript 타입
└── constants/             # 상수
```

### 네이밍 규칙
```
파일명: kebab-case.ts
컴포넌트: PascalCase
함수/변수: camelCase
상수: UPPER_SNAKE_CASE
타입: PascalCase
```

---

## 구현 순서

```
Phase 1: 기반 (1주)
├── 1.1 프로젝트 초기화
├── 1.2 DB 스키마 (Prisma)
├── 1.3 인증 (NextAuth + Kakao)
└── 1.4 기본 레이아웃

Phase 2: 크리에이터 (1주)
├── 2.1 프로필 설정
├── 2.2 크리에이터 페이지 (/@username)
├── 2.3 후원 폼
└── 2.4 후원 API

Phase 3: 결제 (1주)
├── 3.1 토스페이먼츠 연동
├── 3.2 결제 플로우
├── 3.3 결제 완료 처리
└── 3.4 웹훅

Phase 4: 대시보드 (1주)
├── 4.1 대시보드 홈
├── 4.2 후원 내역
├── 4.3 정산 시스템
└── 4.4 연동 도구

Phase 5: 폴리싱 (1주)
├── 5.1 이메일 알림
├── 5.2 에러 처리
├── 5.3 로딩 상태
└── 5.4 반응형

Phase 6: 런칭 (1주)
├── 6.1 랜딩 페이지
├── 6.2 배포 설정
└── 6.3 테스트
```

---

## API 규칙

### 응답 형식
```typescript
// 성공
{ success: true, data: { ... } }

// 실패
{ success: false, error: { code: "ERROR_CODE", message: "한국어 메시지" } }
```

### 에러 코드
| 코드 | HTTP | 설명 |
|------|------|------|
| UNAUTHORIZED | 401 | 로그인 필요 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스 없음 |
| VALIDATION_ERROR | 400 | 유효성 검사 실패 |
| PAYMENT_FAILED | 400 | 결제 실패 |
| INTERNAL_ERROR | 500 | 서버 오류 |

### 예시
```typescript
// app/api/example/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인 (필요시)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다' } },
        { status: 401 }
      );
    }

    // 비즈니스 로직
    const data = await prisma.example.findMany();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
```

---

## 컴포넌트 규칙

### 서버 컴포넌트 (기본)
```typescript
// app/page.tsx
export default async function Page() {
  const data = await fetchData(); // 서버에서 데이터 fetch
  return <div>{data}</div>;
}
```

### 클라이언트 컴포넌트
```typescript
// components/interactive-component.tsx
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState(false);
  // ...
}
```

### 폼 컴포넌트
```typescript
// react-hook-form + zod 사용
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
});

export function ExampleForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });
  // ...
}
```

---

## 상수 정의

```typescript
// src/constants/index.ts

export const APP_NAME = '커피값좀';
export const APP_NAME_EN = 'coffeeworth';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

// 커피 설정
export const DEFAULT_COFFEE_PRICE = 3000;
export const MIN_COFFEE_PRICE = 1000;
export const MAX_COFFEE_PRICE = 100000;
export const COFFEE_PRESETS = [1, 3, 5] as const;
export const DEFAULT_COFFEE_EMOJI = '☕';

// 수수료
export const PLATFORM_FEE_RATE = 0.05; // 5%
export const PG_FEE_RATE = 0.028; // 약 2.8%

// 정산
export const MIN_PAYOUT_AMOUNT = 10000;
export const PAYOUT_DAY = 5; // 금요일

// 제한
export const MAX_MESSAGE_LENGTH = 200;
export const MAX_BIO_LENGTH = 500;
export const MAX_NAME_LENGTH = 50;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_REGEX = /^[a-z0-9_]+$/;

// 테마
export const DEFAULT_THEME_COLOR = '#FFDD00';
```

---

## 금지 사항

### 절대 하지 말 것
```typescript
// ❌ any 타입 사용 금지
const data: any = ...;

// ❌ 하드코딩 금지
const price = 3000;
const name = "커피값좀";

// ❌ console.log 남기기 금지 (console.error만 허용)
console.log('debug');

// ❌ 영어 UI 텍스트
<button>Submit</button>

// ❌ 인라인 스타일
<div style={{ color: 'red' }}>

// ❌ 서버 컴포넌트에서 useState/useEffect
export default function Page() {
  const [state, setState] = useState(); // 에러!
}
```

### 반드시 할 것
```typescript
// ✅ 타입 명시
const data: User = ...;

// ✅ 상수 import
import { DEFAULT_COFFEE_PRICE, APP_NAME } from '@/constants';

// ✅ 한국어 UI
<button>제출하기</button>

// ✅ Tailwind 사용
<div className="text-red-500">

// ✅ 에러 처리
try {
  await api.call();
} catch (error) {
  console.error('Error:', error);
  toast.error('오류가 발생했습니다');
}
```

---

## 참고 문서

| 문서 | 용도 |
|------|------|
| `docs/09-database-schema.md` | DB 스키마 |
| `docs/10-api-specification.md` | API 명세 |
| `docs/11-ui-specification.md` | UI 컴포넌트 |
| `docs/12-implementation-guide.md` | 구현 순서 |
| `docs/13-deployment.md` | 배포 |
| `docs/14-design-system.md` | **디자인 시스템** (필독) |

---

## 작업 시작 전 체크리스트

- [ ] `docs/` 폴더 문서 읽기
- [ ] `constants/index.ts` 확인
- [ ] `.env.example` 확인
- [ ] 기존 코드 패턴 파악
- [ ] 관련 타입 정의 확인
