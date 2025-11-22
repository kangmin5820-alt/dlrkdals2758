# Vercel/Supabase 에러 해결 가이드

## 주요 문제 및 해결 방법

### 1. DietGuide와 Meal 테이블이 없는 경우

**증상:**
- "Table does not exist" 오류
- "relation does not exist" 오류
- 식단가이드 탭에서 에러 발생

**해결 방법:**

Supabase SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- DietGuide 테이블 생성
CREATE TABLE IF NOT EXISTS "DietGuide" (
    "id" SERIAL PRIMARY KEY,
    "memberId" INTEGER NOT NULL UNIQUE,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DietGuide_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Meal 테이블 생성
CREATE TABLE IF NOT EXISTS "Meal" (
    "id" SERIAL PRIMARY KEY,
    "dietGuideId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Meal_dietGuideId_fkey" FOREIGN KEY ("dietGuideId") REFERENCES "DietGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS "DietGuide_memberId_idx" ON "DietGuide"("memberId");
CREATE INDEX IF NOT EXISTS "Meal_dietGuideId_idx" ON "Meal"("dietGuideId");
```

**실행 방법:**
1. Supabase 대시보드 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. 위 SQL 코드를 복사하여 붙여넣기
5. **Run** 버튼 클릭

### 2. DATABASE_URL 환경 변수 확인

**확인 사항:**
1. Vercel 대시보드 > 프로젝트 > Settings > Environment Variables
2. `DATABASE_URL`이 설정되어 있는지 확인
3. Production, Preview, Development 모두에 설정되어 있는지 확인

**올바른 형식:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require
```

또는 연결 풀러 사용 시:
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

### 3. Prisma 클라이언트 생성 확인

**확인:**
- `vercel.json`에 `buildCommand`가 올바르게 설정되어 있는지 확인
- 빌드 로그에서 `prisma generate`가 실행되는지 확인

### 4. 데이터베이스 연결 테스트

웹사이트에서 다음 URL로 접속하여 데이터베이스 연결 상태 확인:
```
https://your-domain.vercel.app/api/health
```

정상이면:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### 5. 배포 후 재시도

1. 테이블 생성 후 Vercel에서 **Redeploy** 실행
2. 또는 새로운 커밋을 푸시하여 자동 재배포

## 에러 메시지별 해결 방법

### "Table does not exist"
→ 위의 SQL 스크립트를 Supabase에서 실행

### "Tenant or user not found"
→ DATABASE_URL의 사용자명과 프로젝트 REF 확인

### "Connection timeout"
→ Supabase 프로젝트가 활성화되어 있는지 확인

### "Prisma Client has not been generated"
→ Vercel 빌드 로그 확인, `prisma generate` 실행 여부 확인

