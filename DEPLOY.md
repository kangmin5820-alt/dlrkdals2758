# 🚀 배포 가이드

이 프로젝트를 온라인에 배포하는 방법입니다.

## 📍 GitHub 저장소
현재 저장소: `https://github.com/kangmin5820-alt/dlrkdals2758.git`

---

## ⚡ Railway 배포 (추천 - 가장 간단)

Railway는 SQLite를 지원하므로 현재 설정 그대로 배포 가능합니다.

### 1. Railway 가입 및 프로젝트 생성

1. [Railway](https://railway.app) 접속
2. "Start a New Project" 클릭
3. GitHub 계정으로 로그인
4. "Deploy from GitHub repo" 선택
5. `kangmin5820-alt/dlrkdals2758` 저장소 선택

### 2. 자동 배포

Railway가 자동으로:
- 코드 감지
- 의존성 설치 (`npm install`)
- Prisma 클라이언트 생성 (`prisma generate`)
- 빌드 (`npm run build`)
- 배포 (`npm start`)

### 3. 데이터베이스 초기화

배포 후 Railway 대시보드에서:

1. 프로젝트 > "New" > "Database" > "SQLite" 선택 (또는 자동 생성됨)
2. 터미널 탭에서 다음 명령어 실행:
   ```bash
   npx prisma db push
   ```

또는 Railway 웹 터미널에서:
```bash
npm run db:push
```

### 4. 배포 완료

Railway가 자동으로 URL을 생성합니다:
- 예: `https://your-project.railway.app`

---

## 🌐 Vercel 배포 (PostgreSQL 필요)

Vercel은 파일 시스템이 읽기 전용이므로 SQLite 대신 PostgreSQL을 사용해야 합니다.

### 1. Supabase 데이터베이스 설정

1. [Supabase](https://supabase.com) 가입
2. 새 프로젝트 생성
3. Settings > Database > Connection string 복사
   - 예: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

### 2. Prisma 스키마 변경

`prisma/schema.prisma` 파일 수정:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

그 다음:
```bash
npx prisma generate
npx prisma db push
```

### 3. Vercel 배포

1. [Vercel](https://vercel.com) 가입 (GitHub 계정)
2. "Add New Project" 클릭
3. `kangmin5820-alt/dlrkdals2758` 저장소 선택
4. Environment Variables 추가:
   - `DATABASE_URL`: Supabase 연결 문자열
5. "Deploy" 클릭

### 4. 빌드 후 마이그레이션

배포 후 Vercel Functions 탭에서:
```bash
npx prisma migrate deploy
```

---

## 📦 Render 배포

### 1. Render 가입
[Render](https://render.com)에 GitHub 계정으로 가입

### 2. 새 Web Service 생성

1. "New +" > "Web Service" 선택
2. GitHub 저장소 연결: `kangmin5820-alt/dlrkdals2758`
3. 설정:
   - **Name**: `pt-trainer-app` (원하는 이름)
   - **Region**: `Seoul` (가장 가까운 지역)
   - **Branch**: `main`
   - **Root Directory**: `.` (기본값)
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
4. "Create Web Service" 클릭

### 3. 데이터베이스 초기화

배포 후 Render Shell에서:
```bash
npm run db:push
```

---

## ✅ 배포 후 확인사항

1. ✅ 로그인 페이지 접속 확인
2. ✅ 로그인 기능 테스트 (아이디: `dlrkdals2758`, 비밀번호: `dnjstnddl2758`)
3. ✅ 회원 추가/수정 기능 테스트
4. ✅ PT 세션 생성 및 운동 기록 테스트
5. ✅ 파일 업로드 기능 테스트 (인바디 이미지)

---

## 🔧 문제 해결

### 빌드 에러
```bash
# 로컬에서 먼저 테스트
npm run build
```

### Prisma 에러
```bash
# Prisma 클라이언트 재생성
npx prisma generate
```

### 데이터베이스 연결 에러
- `DATABASE_URL` 환경 변수 확인
- 데이터베이스 서비스 상태 확인

### 파일 업로드 에러
- **Vercel**: 외부 스토리지(S3, Cloudinary 등) 필요
- **Railway/Render**: `public/uploads` 폴더 사용 가능

---

## 🎯 추천 배포 플랫폼

1. **Railway** ⭐ (가장 간단, SQLite 지원)
2. **Render** (SQLite 지원, 무료 플랜 제공)
3. **Vercel** (PostgreSQL 필요, Next.js 최적화)

---

## 📝 참고사항

- 데이터베이스 파일(`dev.db`)은 `.gitignore`에 포함되어 GitHub에 업로드되지 않습니다.
- 배포 후에는 새 데이터베이스가 생성되므로 기존 데이터는 없습니다.
- 프로덕션 환경에서는 정기적인 데이터베이스 백업을 권장합니다.
