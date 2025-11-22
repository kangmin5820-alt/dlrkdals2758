# DietGuide 및 Meal 테이블 배포 가이드

프로덕션 데이터베이스에 DietGuide와 Meal 테이블을 생성해야 합니다.

## 방법 1: Supabase SQL Editor 사용 (권장)

1. Supabase 대시보드에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. `scripts/setup-diet-tables.sql` 파일의 내용을 복사하여 붙여넣기
5. **Run** 버튼 클릭

## 방법 2: 로컬에서 Prisma 사용

로컬에서 `.env` 파일에 프로덕션 `DATABASE_URL`을 설정한 후:

```bash
npx prisma db push
```

⚠️ **주의**: 프로덕션 데이터베이스에 직접 연결하므로 신중하게 실행하세요.

## 방법 3: Vercel 환경 변수 확인

Vercel 대시보드에서 `DATABASE_URL` 환경 변수가 올바르게 설정되어 있는지 확인하세요.

## 테이블 생성 확인

테이블이 생성되었는지 확인하려면:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('DietGuide', 'Meal');
```

두 테이블이 모두 보이면 성공입니다.

