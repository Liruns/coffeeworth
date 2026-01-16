# 커피값좀 디자인 시스템

> 이 문서는 커피값좀 프로젝트의 디자인 기준점입니다. 모든 UI 작업은 이 가이드라인을 따릅니다.

## 브랜드 아이덴티티

### 핵심 가치
- **따뜻함**: 커피 한 잔의 온기처럼 따뜻한 후원 경험
- **심플함**: 복잡하지 않은, 누구나 쉽게 사용할 수 있는 UI
- **신뢰감**: 투명한 수수료, 안전한 결제

### 브랜드 컬러

| 이름 | HEX | 용도 |
|------|-----|------|
| **Primary (Coffee Yellow)** | `#FFDD00` | 브랜드 컬러, CTA 버튼, 강조 |
| **Primary Dark** | `#E5C700` | Hover 상태 |
| **Coffee Brown** | `#6F4E37` | 보조 강조, 아이콘 |
| **Cream** | `#FFF8E7` | 배경 하이라이트 |

### 시스템 컬러 (shadcn/ui 기반)

```css
/* Light Mode */
--background: #FFFFFF
--foreground: #0A0A0A
--muted: #F5F5F5
--muted-foreground: #737373
--border: #E5E5E5

/* Dark Mode */
--background: #0A0A0A
--foreground: #FAFAFA
--muted: #262626
--muted-foreground: #A3A3A3
--border: rgba(255,255,255,0.1)
```

### 상태 컬러

| 상태 | 컬러 | 용도 |
|------|------|------|
| Success | `#22C55E` | 결제 완료, 성공 메시지 |
| Error | `#EF4444` | 오류, 실패 |
| Warning | `#F59E0B` | 경고 |
| Info | `#3B82F6` | 정보성 안내 |

---

## 타이포그래피

### 폰트 패밀리
- **본문**: Geist Sans (시스템 폰트 fallback)
- **코드**: Geist Mono

### 폰트 스케일

| 이름 | 크기 | 행간 | 용도 |
|------|------|------|------|
| `text-4xl` | 36px | 40px | 히어로 타이틀 |
| `text-3xl` | 30px | 36px | 페이지 타이틀 |
| `text-2xl` | 24px | 32px | 섹션 타이틀 |
| `text-xl` | 20px | 28px | 카드 타이틀 |
| `text-lg` | 18px | 28px | 서브 타이틀 |
| `text-base` | 16px | 24px | 본문 (기본) |
| `text-sm` | 14px | 20px | 보조 텍스트 |
| `text-xs` | 12px | 16px | 캡션, 라벨 |

### 폰트 두께
- `font-normal` (400): 본문
- `font-medium` (500): 강조
- `font-semibold` (600): 타이틀
- `font-bold` (700): 히어로, CTA

---

## 스페이싱

### 기본 단위
4px 배수 시스템 사용 (Tailwind 기본)

| Tailwind | 값 | 용도 |
|----------|-----|------|
| `p-1` | 4px | 아이콘 내부 |
| `p-2` | 8px | 버튼 내부, 작은 요소 |
| `p-3` | 12px | 입력 필드 |
| `p-4` | 16px | 카드 내부 |
| `p-6` | 24px | 섹션 내부 |
| `p-8` | 32px | 큰 섹션 |

### 갭 (Gap)
- 요소 간: `gap-2` ~ `gap-4`
- 섹션 간: `gap-8` ~ `gap-16`
- 페이지 섹션: `gap-16` ~ `gap-24`

---

## 컴포넌트 스타일

### 버튼

```tsx
// Primary (브랜드)
<Button className="bg-[#FFDD00] text-black hover:bg-[#E5C700]">
  커피 후원하기
</Button>

// Secondary
<Button variant="outline">취소</Button>

// Ghost
<Button variant="ghost">더보기</Button>
```

#### 버튼 크기
| 크기 | 높이 | 패딩 | 용도 |
|------|------|------|------|
| `sm` | 32px | px-3 | 인라인, 보조 |
| `default` | 40px | px-4 | 일반 |
| `lg` | 48px | px-6 | CTA, 히어로 |

### 카드

```tsx
<Card className="rounded-xl border shadow-sm">
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>내용</CardContent>
</Card>
```

- 기본 radius: `rounded-xl` (12px)
- 그림자: `shadow-sm` (기본), `shadow-md` (hover)

### 입력 필드

```tsx
<Input 
  className="h-11 rounded-lg"
  placeholder="placeholder..."
/>
```

- 높이: 44px (`h-11`)
- radius: `rounded-lg` (8px)
- Focus: ring 스타일

### 아바타

```tsx
<Avatar className="h-12 w-12">
  <AvatarImage src="..." />
  <AvatarFallback className="bg-[#FFDD00] text-black">
    ☕
  </AvatarFallback>
</Avatar>
```

---

## 레이아웃

### 컨테이너
```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* 콘텐츠 */}
</div>
```

| 이름 | max-width | 용도 |
|------|-----------|------|
| `max-w-md` | 448px | 로그인, 모달 |
| `max-w-lg` | 512px | 후원 폼 |
| `max-w-2xl` | 672px | 크리에이터 페이지 |
| `max-w-4xl` | 896px | 대시보드 콘텐츠 |
| `max-w-7xl` | 1280px | 전체 레이아웃 |

### 반응형 브레이크포인트
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## 아이콘

### 라이브러리
Lucide React 사용

### 크기 가이드
| 용도 | 크기 | 클래스 |
|------|------|--------|
| 버튼 내부 | 16px | `h-4 w-4` |
| 인라인 | 20px | `h-5 w-5` |
| 카드 아이콘 | 24px | `h-6 w-6` |
| 피쳐 아이콘 | 32px | `h-8 w-8` |
| 히어로 | 48px | `h-12 w-12` |

### 주요 아이콘
| 기능 | 아이콘 |
|------|--------|
| 커피/후원 | `Coffee` |
| 사용자 | `User` |
| 설정 | `Settings` |
| 대시보드 | `LayoutDashboard` |
| 통계 | `BarChart3` |
| 정산 | `Wallet` |
| 링크 | `ExternalLink` |
| 복사 | `Copy` |
| 체크 | `Check` |

---

## 애니메이션

### 기본 트랜지션
```css
transition-all duration-200
```

### Hover 효과
- 버튼: 배경색 변경
- 카드: `shadow-md` + 미세 scale
- 링크: 밑줄 또는 색상 변경

### 로딩
- Skeleton: `animate-pulse`
- Spinner: `animate-spin`

---

## 다크 모드

### 지원 방식
`next-themes` 사용, 시스템 설정 따름

### 주의사항
- 브랜드 컬러(#FFDD00)는 다크 모드에서도 유지
- 대비 확인 필수 (접근성)

---

## 접근성

### 필수 사항
- 모든 이미지에 `alt` 텍스트
- 폼 요소에 `label` 연결
- 색상 대비 4.5:1 이상 (WCAG AA)
- 키보드 네비게이션 지원

### 포커스 스타일
```css
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

---

## 페이지별 가이드

### 랜딩 페이지
- 히어로: 브랜드 컬러 강조, 큰 타이포그래피
- 피쳐: 아이콘 + 텍스트 카드
- CTA: Primary 버튼, 명확한 액션

### 크리에이터 페이지 (/@username)
- 프로필: 아바타 + 이름 + 소개
- 후원 폼: 카드 형태, 커피 개수 선택
- 최근 후원자: 리스트 형태

### 대시보드
- 사이드바: 네비게이션
- 통계: 카드 그리드
- 테이블: 후원 내역

---

## 코드 컨벤션

### 클래스 순서 (Tailwind)
1. 레이아웃 (flex, grid, position)
2. 박스 모델 (w, h, p, m)
3. 타이포그래피 (text, font)
4. 비주얼 (bg, border, shadow)
5. 인터랙티브 (hover, focus)
6. 반응형 (sm:, md:, lg:)

### 예시
```tsx
<div className="flex items-center gap-4 p-4 text-sm font-medium bg-card border rounded-lg hover:shadow-md sm:p-6">
```

---

## 참고

- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
