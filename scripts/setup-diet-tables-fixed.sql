-- DietGuide와 Meal 테이블 생성 스크립트 (수정 버전)
-- Supabase SQL Editor에서 실행하세요

-- 기존 테이블이 있다면 삭제 (주의: 데이터가 모두 삭제됩니다)
DROP TABLE IF EXISTS "Meal";
DROP TABLE IF EXISTS "DietGuide";

-- DietGuide 테이블 생성
CREATE TABLE "DietGuide" (
    "id" SERIAL PRIMARY KEY,
    "memberId" INTEGER NOT NULL UNIQUE,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DietGuide_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Meal 테이블 생성
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

