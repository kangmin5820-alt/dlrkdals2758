# Vercel 배포 오류 해결 가이드

## 일반적인 Vercel 배포 오류

### 1. DATABASE_URL 환경 변수 미설정

**증상:**
- 빌드는 성공하지만 런타임에서 데이터베이스 연결 오류
- "Environment variable not found: DATABASE_URL" 오류

**해결:**
1. Vercel 대시보드 접속
2. 프로젝트 선택
3. **Settings** > **Environment Variables** 이동
4. **Add New** 클릭
5. 다음 설정:
   - **Key**: `DATABASE_URL`
   - **Value**: Supabase 연결 문자열
   - **Environment**: Production, Preview, Development 모두 선택
6. **Save** 클릭
7. **Redeploy** 클릭

**올바른 DATABASE_URL 형식:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require
```

### 2. Prisma 클라이언트 생성 실패

**증상:**
- 빌드 로그에 Prisma 관련 오류
- "Prisma Client has not been generated yet" 오류

**해결:**
`vercel.json`과 `package.json`에 이미 설정되어 있지만 확인:

```json
{
  "buildCommand": "npx prisma generate && npm run build"
}
```

### 3. 데이터베이스 스키마 미생성

**증상:**
- "Table does not exist" 오류
- 데이터베이스 연결은 되지만 테이블이 없음

**해결:**
로컬에서 마이그레이션 실행 후 Vercel에 배포:

```bash
npx prisma db push
```

또는 Vercel Functions에서 실행:

1. Vercel 대시보드 > 프로젝트 > Functions 탭
2. 터미널 열기
3. 다음 명령어 실행:
```bash
npx prisma db push
```

### 4. 연결 풀 제한 초과

**증상:**
- "Too many connections" 오류
- 간헐적인 연결 실패

**해결:**
Supabase 연결 풀러 사용:

1. Supabase 대시보드 > Settings > Database
2. Connection pooling 선택
3. Transaction mode 권장
4. 연결 문자열을 Vercel 환경 변수에 업데이트

### 5. 빌드 타임아웃

**증상:**
- 빌드가 60초 이상 걸림
- 타임아웃 오류

**해결:**
`vercel.json` 최적화:

```json
{
  "buildCommand": "npx prisma generate && npm run build",
  "installCommand": "npm install --legacy-peer-deps"
}
```

## Vercel 환경 변수 설정 체크리스트

- [ ] `DATABASE_URL` 설정됨
- [ ] Production, Preview, Development 모두 설정
- [ ] 연결 문자열에 `?sslmode=require` 포함
- [ ] 비밀번호가 올바름
- [ ] 배포 후 Redeploy 실행

## 배포 후 확인사항

1. **Vercel 로그 확인**
   - Vercel 대시보드 > 프로젝트 > Deployments
   - 최신 배포 클릭 > Functions 탭
   - 런타임 로그 확인

2. **데이터베이스 연결 테스트**
   - 웹사이트 접속
   - 로그인 페이지 확인
   - 회원 목록 페이지 확인

3. **에러 모니터링**
   - Vercel 대시보드 > 프로젝트 > Logs
   - 실시간 로그 확인

## 빠른 문제 해결

### 환경 변수 확인
```bash
# 로컬에서 테스트
echo $DATABASE_URL
```

### Prisma 클라이언트 확인
```bash
npx prisma generate
npx prisma validate
```

### 데이터베이스 연결 테스트
```bash
npm run db:test
```

## Vercel Functions에서 직접 실행

Vercel 대시보드에서:
1. 프로젝트 > Functions 탭
2. 터미널 열기
3. 다음 명령어 실행:

```bash
# 환경 변수 확인
echo $DATABASE_URL

# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 스키마 푸시
npx prisma db push

# 연결 테스트
npx prisma db pull
```

## 참고

- Vercel 문서: https://vercel.com/docs
- Prisma 배포 가이드: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- Supabase 연결 가이드: https://supabase.com/docs/guides/database/connecting-to-postgres

