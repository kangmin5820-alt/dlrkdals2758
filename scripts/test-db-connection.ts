import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('🔄 데이터베이스 연결 테스트 중...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '설정됨 (비밀번호는 숨김)' : '없음');
    
    await prisma.$connect();
    console.log('✅ 데이터베이스 연결 성공!');
    
    // 간단한 쿼리 테스트
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ 쿼리 테스트 성공:', result);
    
    await prisma.$disconnect();
    console.log('✅ 연결 종료 완료');
  } catch (error: any) {
    console.error('❌ 데이터베이스 연결 실패:');
    console.error('에러 코드:', error.code);
    console.error('에러 메시지:', error.message);
    
    if (error.code === 'P1001') {
      console.error('\n💡 P1001 오류 해결 방법:');
      console.error('1. DATABASE_URL이 올바른지 확인하세요');
      console.error('2. Supabase 프로젝트가 활성화되어 있는지 확인하세요');
      console.error('3. 네트워크 방화벽 설정을 확인하세요');
      console.error('4. DATABASE_URL 형식: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require');
    }
    
    if (error.message?.includes('Tenant or user not found')) {
      console.error('\n💡 "Tenant or user not found" 오류 해결 방법:');
      console.error('1. Supabase 대시보드 > Settings > Database에서 올바른 연결 문자열 복사');
      console.error('2. 연결 풀러를 사용하는 경우, 형식 확인:');
      console.error('   - Transaction mode: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require');
      console.error('   - Session mode: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require');
      console.error('3. 직접 연결 사용 시: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require');
      console.error('4. 비밀번호에 특수문자가 있으면 URL 인코딩 필요 (! -> %21, @ -> %40 등)');
      console.error('5. Supabase 프로젝트 REF가 올바른지 확인 (Settings > General > Reference ID)');
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();

