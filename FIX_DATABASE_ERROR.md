# 데이터베이스 연결 오류 해결 가이드

## 현재 발생 중인 오류

```
Error querying the database: FATAL: Tenant or user not found
```

## 원인

이 오류는 Supabase 연결 문자열의 **사용자명 또는 프로젝트 REF가 잘못**되었을 때 발생합니다.

## 해결 방법

### 1. Supabase에서 올바른 연결 문자열 가져오기

#### 방법 A: 직접 연결 (Direct Connection) 사용

1. Supabase 대시보드 접속
2. 프로젝트 선택
3. **Settings** > **Database** 이동
4. **Connection string** 섹션에서:
   - **Connection pooling** 탭이 아닌 **URI** 탭 선택
   - **URI** 형식 복사
   - 형식: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require`

#### 방법 B: 연결 풀러 사용 (권장하지만 형식 주의)

1. Supabase 대시보드 > Settings > Database
2. **Connection string** 섹션에서 **Connection pooling** 탭 선택
3. **Transaction mode** 또는 **Session mode** 선택
4. **올바른 형식**:
   - Transaction mode: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require`
   - Session mode: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require`

**⚠️ 중요:**
- 연결 풀러 사용 시 사용자명이 `postgres.[PROJECT_REF]` 형식이어야 합니다
- 프로젝트 REF는 Supabase Settings > General > Reference ID에서 확인

### 2. .env 파일 수정

`.env` 파일을 열고 `DATABASE_URL`을 위에서 복사한 올바른 연결 문자열로 교체:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
```

### 3. 비밀번호 URL 인코딩

비밀번호에 특수문자가 있으면 URL 인코딩 필요:
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- 등등...

또는 `.env` 파일에서 따옴표로 감싸면 자동 처리됨:
```env
DATABASE_URL="postgresql://postgres:비밀번호!@#$@db.xxx.supabase.co:5432/postgres?sslmode=require"
```

### 4. 프로젝트 REF 확인

1. Supabase 대시보드 > Settings > General
2. **Reference ID** 확인
3. DATABASE_URL의 프로젝트 REF가 일치하는지 확인

### 5. 연결 테스트

`.env` 파일 수정 후:

```bash
npm run db:test
```

성공하면:
```bash
npx prisma db push
```

## 일반적인 실수

### ❌ 잘못된 형식들

1. **연결 풀러 URL에 잘못된 사용자명**
   ```
   postgresql://postgres:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
   ```
   → 올바른 형식: `postgresql://postgres.PROJECT_REF:PASSWORD@...`

2. **SSL 모드 누락**
   ```
   postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
   ```
   → 올바른 형식: `...?sslmode=require` 추가

3. **직접 연결과 연결 풀러 혼용**
   - 직접 연결: `db.[PROJECT_REF].supabase.co`
   - 연결 풀러: `aws-0-[REGION].pooler.supabase.com`

## 빠른 체크리스트

- [ ] Supabase 프로젝트가 Active 상태
- [ ] DATABASE_URL 형식이 올바름
- [ ] 비밀번호가 정확함 (Show 비밀번호로 확인)
- [ ] 프로젝트 REF가 일치함
- [ ] `?sslmode=require` 포함됨
- [ ] 연결 풀러 사용 시 사용자명이 `postgres.PROJECT_REF` 형식
- [ ] 비밀번호 특수문자 URL 인코딩됨

## 여전히 문제가 있다면

1. Supabase 대시보드에서 **새 연결 문자열 생성**
2. **직접 연결(URI)** 사용 시도
3. Supabase 프로젝트 재시작
4. 다른 Supabase 프로젝트로 테스트

