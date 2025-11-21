# PT 트레이너 회원 관리 시스템

1인 PT 트레이너를 위한 회원 관리 웹 애플리케이션입니다.

## 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** + **SQLite**

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 데이터베이스 설정

Prisma 클라이언트를 생성하고 데이터베이스를 초기화합니다:

```bash
npm run db:generate
npm run db:push
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 주요 기능

### 회원 관리
- 회원 목록 조회 및 이름 검색
- 신규 회원 추가
- 회원 상세 정보 관리

### 회원 상세 정보
- **기본정보**: 키, 체중, 목표 체중, 체지방률, 골격근량 등
- **생활패턴**: 수면시간, 직업, 운동경험, 흡연/음주
- **상세메모**: 회원에 대한 자유 메모
- **인바디**: 인바디 기록 추가 및 조회 (날짜, 이미지)
- **PT 세션**: PT 세션 목록 및 관리

### PT 세션 관리
- PT 세션별 운동 기록
- 운동 종목 추가
- 세트별 무게, 횟수, 휴식 시간 기록
- 운동별 피드백 작성
- 오늘의 메모 및 과제 관리

## 프로젝트 구조

```
app/
├── members/
│   ├── page.tsx              # 회원 목록
│   ├── new/
│   │   └── page.tsx          # 신규 회원 추가
│   └── [id]/
│       ├── page.tsx          # 회원 상세
│       ├── MemberTabs.tsx    # 탭 UI
│       ├── actions.ts        # Server Actions
│       ├── tabs/             # 각 탭 컴포넌트
│       └── sessions/
│           └── [sessionId]/
│               ├── page.tsx  # PT 세션 상세
│               ├── actions.ts
│               └── ...       # 세션 관련 컴포넌트
├── layout.tsx
├── page.tsx                  # 홈 (리다이렉트)
└── globals.css

prisma/
└── schema.prisma             # Prisma 스키마

lib/
└── prisma.ts                 # Prisma 클라이언트 싱글톤
```

## 데이터베이스 관리

### Prisma Studio 실행
데이터베이스를 시각적으로 확인하고 수정할 수 있습니다:

```bash
npm run db:studio
```

### 스키마 변경 후
스키마를 변경한 경우:

```bash
npm run db:push
```

## 환경 설정

현재 프로젝트는 SQLite를 사용하며, `prisma/dev.db` 파일에 데이터가 저장됩니다.
이 파일은 `.gitignore`에 포함되어 있습니다.

## 라이선스

MIT

