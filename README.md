# ☕ 커피값좀 (coffeeworth)

> 한국 개발자와 블로거를 위한 후원 플랫폼

Buy Me a Coffee의 한국형 대안 서비스입니다. 카카오페이/토스페이먼츠 결제, 원화 정산, 5% 수수료 모델을 제공합니다.

## ✨ 주요 기능

- **크리에이터 페이지** - `/@username` 형태의 개인 후원 페이지
- **간편 결제** - 토스페이먼츠 연동 (카카오페이, 토스페이, 카드)
- **실시간 알림** - 후원 시 이메일 알림
- **대시보드** - 후원 내역, 통계, 정산 관리
- **한국어 UI** - 완전한 한국어 인터페이스

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| **프론트엔드** | Next.js 16 (App Router), TypeScript, Tailwind CSS 4 |
| **UI 컴포넌트** | shadcn/ui, Radix UI |
| **백엔드** | Next.js API Routes |
| **데이터베이스** | PostgreSQL, Prisma 5 |
| **인증** | NextAuth v5 (Kakao OAuth) |
| **결제** | 토스페이먼츠 SDK |
| **이메일** | Resend |

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- Docker (PostgreSQL용)
- npm 또는 yarn

### 설치

```bash
# 레포지토리 클론
git clone https://github.com/Liruns/coffeeworth.git
cd coffeeworth

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 수정하여 필요한 값 입력
```

### 로컬 개발 환경

```bash
# Docker로 PostgreSQL 시작
npm run docker:up

# DB 스키마 적용 + 시드 데이터
npm run db:setup

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인하세요.

### 테스트 계정

개발 모드에서 `ENABLE_DEV_LOGIN=true` 설정 시 이메일로 로그인 가능:

- **크리에이터**: `creator@test.com` (페이지: `/testcreator`)
- **후원자**: `supporter@test.com`

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # 공개 페이지
│   │   ├── login/         # 로그인
│   │   └── [username]/    # 크리에이터 페이지
│   ├── (dashboard)/       # 대시보드 (인증 필요)
│   │   └── dashboard/
│   └── api/               # API Routes
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   ├── creator/           # 크리에이터 관련
│   └── common/            # 공통 컴포넌트
├── lib/                   # 유틸리티
├── constants/             # 상수
└── types/                 # TypeScript 타입
```

## 📜 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run docker:up` | PostgreSQL 컨테이너 시작 |
| `npm run docker:down` | PostgreSQL 컨테이너 중지 |
| `npm run db:push` | DB 스키마 적용 |
| `npm run db:seed` | 테스트 데이터 생성 |
| `npm run db:studio` | Prisma Studio 실행 |
| `npm run db:setup` | 스키마 + 시드 한번에 |

## 🔧 환경 변수

`.env.example` 파일을 참고하여 `.env.local`을 설정하세요:

```env
# 필수
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# 카카오 OAuth (프로덕션)
KAKAO_CLIENT_ID=""
KAKAO_CLIENT_SECRET=""

# 토스페이먼츠
NEXT_PUBLIC_TOSS_CLIENT_KEY="test_ck_..."
TOSS_SECRET_KEY="test_sk_..."

# 개발 모드
ENABLE_DEV_LOGIN="true"
```

## 📚 문서

자세한 기획 및 구현 문서는 [`docs/`](./docs) 폴더를 참고하세요:

- [프로젝트 개요](./docs/01-overview.md)
- [데이터베이스 스키마](./docs/09-database-schema.md)
- [API 명세](./docs/10-api-specification.md)
- [UI 명세](./docs/11-ui-specification.md)
- [구현 가이드](./docs/12-implementation-guide.md)

## 📄 라이선스

MIT License
