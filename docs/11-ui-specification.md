# 11. UI 명세

## 디자인 시스템

### 색상

```typescript
// tailwind.config.ts

const colors = {
  // 브랜드 색상
  brand: {
    DEFAULT: '#FFDD00',  // 커피값좀 노랑
    dark: '#E6C700',
    light: '#FFF4B3',
  },
  
  // 시맨틱 색상
  success: '#10B981',  // 결제 완료
  error: '#EF4444',    // 에러
  warning: '#F59E0B',  // 경고
  info: '#3B82F6',     // 정보
  
  // 중립색
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};
```

### 타이포그래피

```typescript
const typography = {
  fontFamily: {
    sans: ['Pretendard', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
};
```

### 간격

```typescript
const spacing = {
  // 기본 간격 (4px 단위)
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem', // 40px
  12: '3rem',   // 48px
  16: '4rem',   // 64px
};
```

---

## 페이지 구조

### 1. 랜딩 페이지 (/)

```
┌────────────────────────────────────────────────────────┐
│ [로고] 커피값좀                    [로그인] [시작하기] │ <- 헤더
├────────────────────────────────────────────────────────┤
│                                                        │
│              ☕ 커피값좀                               │
│     "당신의 콘텐츠에 커피값좀 보태드릴게요"            │
│                                                        │
│     한국 개발자와 블로거를 위한                        │
│     가장 쉬운 후원 플랫폼                              │
│                                                        │
│              [무료로 시작하기]                         │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ 카카오   │ │ 5%       │ │ GitHub   │              │
│  │ 토스 결제│ │ 낮은수수료│ │ 뱃지지원 │              │
│  └──────────┘ └──────────┘ └──────────┘              │
├────────────────────────────────────────────────────────┤
│                                                        │
│              [크리에이터 페이지 예시]                  │
│                                                        │
├────────────────────────────────────────────────────────┤
│  FAQ / 자주 묻는 질문                                 │
├────────────────────────────────────────────────────────┤
│  © 2024 커피값좀                                      │ <- 푸터
└────────────────────────────────────────────────────────┘
```

### 2. 크리에이터 페이지 (/@username)

```
┌────────────────────────────────────────────────────────┐
│                     [커피값좀 로고]                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│                    [프로필 이미지]                     │
│                      김개발                            │
│                    @johndoe                            │
│                                                        │
│     풀스택 개발자입니다.                              │
│     오픈소스와 기술 블로그를 운영하고 있어요.         │
│                                                        │
│     [GitHub] [Blog] [Twitter]                         │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐ │
│  │  ☕ 커피 한 잔 사주기                            │ │
│  │                                                  │ │
│  │  [1잔 ₩3,000] [3잔 ₩9,000] [5잔 ₩15,000]       │ │
│  │                                                  │ │
│  │  또는 직접 입력: [____] 잔                      │ │
│  │                                                  │ │
│  │  이름 (선택)                                    │ │
│  │  [________________________]                     │ │
│  │  [x] 익명으로 후원하기                          │ │
│  │                                                  │ │
│  │  응원 메시지 (선택)                             │ │
│  │  [________________________]                     │ │
│  │  [________________________]                     │ │
│  │                                                  │ │
│  │         [☕ 커피값 보내기]                       │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
├────────────────────────────────────────────────────────┤
│  최근 서포터                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │ 익명 · ☕×1 · 1시간 전                         │   │
│  │ "좋은 글 감사합니다!"                          │   │
│  ├────────────────────────────────────────────────┤   │
│  │ 서준 · ☕×3 · 어제                             │   │
│  │ "항상 도움받고 있어요"                         │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
├────────────────────────────────────────────────────────┤
│  Powered by 커피값좀                                  │
└────────────────────────────────────────────────────────┘
```

### 3. 대시보드 (/dashboard)

```
┌────────────────────────────────────────────────────────┐
│ [로고]                              [프로필] [로그아웃]│
├────────────┬───────────────────────────────────────────┤
│            │                                           │
│  홈        │  이번 달 후원                            │
│  서포터    │  ┌─────────────────────────────────────┐ │
│  정산      │  │  ₩150,000                           │ │
│  연동도구  │  │  커피 50잔                          │ │
│  설정      │  └─────────────────────────────────────┘ │
│            │                                           │
│            │  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│            │  │ 총 후원   │ │ 정산예정  │ │ 서포터   │ │
│            │  │ ₩500,000 │ │ ₩142,500 │ │ 45명    │ │
│            │  └──────────┘ └──────────┘ └──────────┘ │
│            │                                           │
│            │  최근 후원                               │
│            │  ┌─────────────────────────────────────┐ │
│            │  │ 날짜 | 이름 | 금액 | 메시지 | 상태  │ │
│            │  │ 1/15 | 서준 | 9000 | 감사..  | 완료 │ │
│            │  │ 1/14 | 익명 | 3000 | -       | 완료 │ │
│            │  └─────────────────────────────────────┘ │
│            │                                           │
└────────────┴───────────────────────────────────────────┘
```

---

## 컴포넌트 명세

### 1. CoffeeButton (커피 선택 버튼)

```typescript
// components/coffee-button.tsx

interface CoffeeButtonProps {
  count: number;           // 커피 개수
  price: number;           // 총 가격
  selected: boolean;       // 선택 여부
  onClick: () => void;
}

// 사용 예시
<CoffeeButton count={1} price={3000} selected={false} onClick={() => {}} />
<CoffeeButton count={3} price={9000} selected={true} onClick={() => {}} />
<CoffeeButton count={5} price={15000} selected={false} onClick={() => {}} />
```

**스타일**
```css
/* 기본 상태 */
.coffee-button {
  @apply px-4 py-3 rounded-lg border-2 border-gray-200;
  @apply hover:border-brand transition-colors;
}

/* 선택 상태 */
.coffee-button.selected {
  @apply border-brand bg-brand/10;
}
```

### 2. SupportCard (후원 카드)

```typescript
// components/support-card.tsx

interface SupportCardProps {
  supporterName: string;
  isAnonymous: boolean;
  coffeeCount: number;
  message?: string;
  createdAt: Date;
}

// 사용 예시
<SupportCard
  supporterName="서준"
  isAnonymous={false}
  coffeeCount={3}
  message="좋은 글 감사합니다!"
  createdAt={new Date()}
/>
```

### 3. CreatorCard (크리에이터 프로필 카드)

```typescript
// components/creator-card.tsx

interface CreatorCardProps {
  name: string;
  username: string;
  image?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    blog?: string;
    twitter?: string;
  };
}
```

### 4. SupportForm (후원 폼)

```typescript
// components/support-form.tsx

interface SupportFormProps {
  creatorUsername: string;
  coffeePrice: number;
  coffeeEmoji: string;
  onSubmit: (data: SupportFormData) => void;
  isLoading: boolean;
}

interface SupportFormData {
  coffeeCount: number;
  message?: string;
  supporterName?: string;
  supporterEmail?: string;
  isAnonymous: boolean;
}
```

### 5. PaymentButton (결제 버튼)

```typescript
// components/payment-button.tsx

interface PaymentButtonProps {
  amount: number;
  orderName: string;
  orderId: string;
  onSuccess: (paymentKey: string) => void;
  onFail: (error: Error) => void;
}
```

### 6. StatCard (통계 카드)

```typescript
// components/stat-card.tsx

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// 사용 예시
<StatCard
  title="이번 달 후원"
  value="₩150,000"
  subValue="커피 50잔"
  icon={<CoffeeIcon />}
  trend={{ value: 12, isPositive: true }}
/>
```

### 7. Badge (GitHub 뱃지)

```typescript
// components/badge.tsx

interface BadgeProps {
  username: string;
  style?: 'default' | 'flat' | 'plastic';
  size?: 'small' | 'medium' | 'large';
}

// 뱃지 이미지 생성 API
// GET /api/badge/[username]?style=default&size=medium
```

---

## 반응형 브레이크포인트

```typescript
const breakpoints = {
  sm: '640px',   // 모바일
  md: '768px',   // 태블릿
  lg: '1024px',  // 데스크톱
  xl: '1280px',  // 대형 데스크톱
};
```

### 모바일 우선 디자인

```css
/* 모바일 기본 */
.container {
  @apply px-4;
}

/* 태블릿 이상 */
@screen md {
  .container {
    @apply px-6 max-w-2xl mx-auto;
  }
}

/* 데스크톱 이상 */
@screen lg {
  .container {
    @apply px-8 max-w-4xl;
  }
}
```

---

## 상태 & 인터랙션

### 로딩 상태

```typescript
// 버튼 로딩
<Button disabled={isLoading}>
  {isLoading ? <Spinner /> : '커피값 보내기'}
</Button>

// 페이지 로딩
<PageSkeleton /> // 스켈레톤 UI

// 데이터 로딩
{isLoading ? <TableSkeleton rows={5} /> : <DataTable data={data} />}
```

### 에러 상태

```typescript
// 폼 에러
<Input
  error={errors.message?.message}
  {...register('message')}
/>

// 페이지 에러
<ErrorState
  title="페이지를 찾을 수 없습니다"
  description="요청하신 크리에이터 페이지가 존재하지 않습니다."
  action={{ label: '홈으로', href: '/' }}
/>
```

### 빈 상태

```typescript
<EmptyState
  icon={<CoffeeIcon />}
  title="아직 후원 내역이 없습니다"
  description="첫 번째 서포터를 기다리고 있어요!"
  action={{ label: '페이지 공유하기', onClick: shareUrl }}
/>
```

### 성공 상태

```typescript
// 결제 완료
<SuccessState
  title="후원 완료!"
  description="김개발님에게 커피 3잔을 선물했어요"
  icon={<CheckCircleIcon />}
/>

// 토스트
toast.success('프로필이 저장되었습니다');
toast.error('결제에 실패했습니다');
```

---

## 접근성

### 필수 요구사항

- [ ] 모든 이미지에 alt 텍스트
- [ ] 폼 요소에 label 연결
- [ ] 키보드 네비게이션 지원
- [ ] 색상 대비 4.5:1 이상
- [ ] 포커스 표시자 명확히

### 예시

```tsx
// Good
<label htmlFor="message">응원 메시지</label>
<textarea
  id="message"
  aria-describedby="message-hint"
  aria-invalid={!!errors.message}
/>
<span id="message-hint">최대 200자까지 입력 가능합니다</span>

// Bad
<textarea placeholder="메시지를 입력하세요" />
```
