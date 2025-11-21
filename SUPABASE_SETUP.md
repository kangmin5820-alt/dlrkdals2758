# Supabase 연결 설정 가이드

## P1001 오류 해결 방법

### 1. DATABASE_URL 형식 확인

Supabase는 SSL 연결이 필요합니다. `.env` 파일의 `DATABASE_URL` 형식이 올바른지 확인하세요:

**올바른 형식:**
```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require"
```

또는 연결 풀러 사용 시:
```
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require"
```

**잘못된 형식 (SSL 없음):**
```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

### 2. Supabase에서 올바른 연결 문자열 가져오기

1. Supabase 대시보드 접속
2. 프로젝트 선택
3. **Settings** > **Database** 이동
4. **Connection string** 섹션에서 **URI** 선택
5. `?sslmode=require`가 포함되어 있는지 확인
6. 비밀번호가 올바른지 확인 (Show 비밀번호 클릭)

### 3. .env 파일 확인

`.env` 파일이 프로젝트 루트에 있는지 확인:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
```

### 4. Supabase 프로젝트 상태 확인

- Supabase 대시보드에서 프로젝트가 **Active** 상태인지 확인
- 프로젝트가 일시 중지되었는지 확인

### 5. 방화벽/네트워크 확인

- 방화벽이 5432 포트를 차단하고 있지 않은지 확인
- VPN을 사용 중이라면 연결 해제 후 테스트

### 6. Prisma 연결 테스트

다음 명령어로 연결을 테스트하세요:

```bash
npm run db:test
```

또는:

```bash
npx prisma db pull
```

### 7. 연결 풀러 사용 (권장)

Supabase 연결 풀러를 사용하면 더 안정적인 연결이 가능합니다:

1. Supabase 대시보드 > Settings > Database
2. **Connection string** 섹션에서 **Connection pooling** 선택
3. **Transaction mode** 또는 **Session mode** 중 선택
4. 연결 문자열을 `.env`의 `DATABASE_URL`에 복사

**연결 풀러 형식 (Transaction mode):**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

**연결 풀러 형식 (Session mode):**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require
```

### 8. Prisma 스키마 마이그레이션

연결이 성공하면 데이터베이스에 스키마를 푸시:

```bash
npx prisma db push
```

또는 마이그레이션 사용:

```bash
npx prisma migrate dev --name init
```

## 문제 해결 체크리스트

- [ ] DATABASE_URL에 `?sslmode=require` 포함되어 있음
- [ ] 비밀번호가 올바름 (특수문자 이스케이프 확인)
- [ ] 프로젝트 REF가 올바름
- [ ] Supabase 프로젝트가 Active 상태
- [ ] 방화벽이 포트 5432를 차단하지 않음
- [ ] `.env` 파일이 프로젝트 루트에 있음
- [ ] Prisma 클라이언트가 최신 상태 (`npx prisma generate`)

## 참고

- Supabase 문서: https://supabase.com/docs/guides/database/connecting-to-postgres
- Prisma PostgreSQL 가이드: https://www.prisma.io/docs/concepts/database-connectors/postgresql

