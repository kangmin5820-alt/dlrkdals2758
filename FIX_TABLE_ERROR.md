# 테이블 생성 후 에러 해결 가이드

## 문제: 테이블을 생성했지만 여전히 에러 발생

### 해결 방법 1: updatedAt 필드 수정

기존 테이블을 생성했다면, `updatedAt` 필드에 DEFAULT 값을 추가해야 합니다:

```sql
-- DietGuide 테이블의 updatedAt 수정
ALTER TABLE "DietGuide" 
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- Meal 테이블의 updatedAt 수정
ALTER TABLE "Meal" 
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
```

### 해결 방법 2: 테이블 재생성 (권장)

기존 테이블을 삭제하고 다시 생성:

```sql
-- 기존 테이블 삭제 (주의: 데이터가 모두 삭제됩니다)
DROP TABLE IF EXISTS "Meal";
DROP TABLE IF EXISTS "DietGuide";

-- 테이블 재생성
CREATE TABLE "DietGuide" (
    "id" SERIAL PRIMARY KEY,
    "memberId" INTEGER NOT NULL UNIQUE,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DietGuide_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Meal" (
    "id" SERIAL PRIMARY KEY,
    "dietGuideId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Meal_dietGuideId_fkey" FOREIGN KEY ("dietGuideId") REFERENCES "DietGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 인덱스 생성
CREATE INDEX "DietGuide_memberId_idx" ON "DietGuide"("memberId");
CREATE INDEX "Meal_dietGuideId_idx" ON "Meal"("dietGuideId");
```

### 해결 방법 3: Vercel 재배포

테이블을 생성/수정한 후:

1. Vercel 대시보드 접속
2. 프로젝트 선택
3. **Deployments** 탭
4. 최신 배포 옆 **...** 메뉴 클릭
5. **Redeploy** 선택

또는 새로운 커밋을 푸시하여 자동 재배포

### 해결 방법 4: 테이블 존재 확인

Supabase SQL Editor에서 테이블이 제대로 생성되었는지 확인:

```sql
-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('DietGuide', 'Meal');

-- 테이블 구조 확인
\d "DietGuide"
\d "Meal"
```

### 해결 방법 5: Prisma 클라이언트 재생성

로컬에서:

```bash
npx prisma generate
```

Vercel에서는 빌드 시 자동으로 생성되지만, 수동으로 확인하려면:
- Vercel 빌드 로그에서 `prisma generate` 실행 여부 확인

## 일반적인 에러 메시지별 해결

### "column does not have a default value"
→ `updatedAt` 필드에 DEFAULT 값을 추가 (위 해결 방법 1 참조)

### "relation does not exist"
→ 테이블이 생성되지 않음, SQL 스크립트 다시 실행

### "duplicate key value violates unique constraint"
→ 테이블이 이미 존재함, DROP 후 재생성

### "Prisma Client has not been generated"
→ Vercel 재배포 필요

