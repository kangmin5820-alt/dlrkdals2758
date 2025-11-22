import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Suspense } from 'react';
import LogoutButton from '@/app/components/LogoutButton';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function MembersList({ searchQuery }: { searchQuery?: string }) {
  try {
    const members = await prisma.member.findMany({
      where: searchQuery
        ? {
            name: {
              contains: searchQuery,
            },
          }
        : undefined,
      select: {
        id: true,
        name: true,
        phone: true,
        sessions: {
          select: {
            date: true,
          },
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 30,
    });

    return (
      <div className="overflow-x-auto rounded border border-[#1a1a1a]">
        <table className="min-w-full bg-[#0a0a0a]">
          <thead className="bg-black">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                이름
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                전화번호
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                최근 PT 세션
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#0a0a0a] divide-y divide-[#1a1a1a]">
            {members.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-gray-500 text-xs">
                  회원이 없습니다.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="hover:bg-[#111111] transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Link
                      href={`/members/${member.id}`}
                      prefetch={true}
                      className="text-gray-300 hover:text-white font-semibold cursor-pointer block transition-colors text-xs"
                    >
                      {member.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-400">
                    {member.phone || '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-400">
                    {member.sessions[0]
                      ? new Date(member.sessions[0].date).toLocaleDateString('ko-KR')
                      : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  } catch (error: any) {
    console.error('회원 목록 조회 오류:', error);
    const errorMessage = error?.message || '알 수 없는 오류';
    const isConnectionError = 
      error?.code?.startsWith('P1') || 
      errorMessage.includes('connection') || 
      errorMessage.includes('connect') ||
      errorMessage.includes('DATABASE_URL');
    
    return (
      <div className="text-center py-6 border border-red-500/20 rounded bg-red-500/10 p-4">
        <p className="text-red-400 text-xs font-semibold mb-2">
          회원 목록을 불러오는 중 오류가 발생했습니다.
        </p>
        {isConnectionError && (
          <p className="text-gray-500 text-xs mb-2">
            데이터베이스 연결을 확인해주세요. Vercel 환경 변수에서 DATABASE_URL을 확인하세요.
          </p>
        )}
        <p className="text-gray-600 text-xs">
          {errorMessage}
        </p>
      </div>
    );
  }

}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const searchQuery = searchParams.q;

  try {
    return (
      <div className="min-h-screen bg-black p-3">
        <div className="max-w-7xl mx-auto">
          <div className="mb-3 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-0.5">
                회원 목록
              </h1>
              <p className="text-gray-500 text-xs">PT 트레이너 회원 관리 시스템</p>
            </div>
            <div className="flex gap-2 items-center">
              <Link
                href="/members/new"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded text-xs font-semibold transition-colors border border-white/10"
              >
                + 신규 회원 추가
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mb-3">
            <form method="get" className="flex gap-2">
              <input
                type="text"
                name="q"
                placeholder="이름으로 검색..."
                defaultValue={searchQuery}
                className="px-3 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex-1 text-white text-xs placeholder-gray-500 transition-all"
              />
              <button
                type="submit"
                className="bg-[#1a1a1a] text-white px-4 py-1.5 rounded hover:bg-[#2a2a2a] transition-colors text-xs font-semibold"
              >
                검색
              </button>
            </form>
          </div>

          <Suspense fallback={<div className="text-center py-6 text-gray-500 text-xs">로딩 중...</div>}>
            <MembersList searchQuery={searchQuery} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('회원 목록 페이지 오류:', error);
    return (
      <div className="min-h-screen bg-black p-3">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-400 text-sm mb-4">
              페이지를 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="text-gray-500 text-xs mb-4">
              {error?.message || '알 수 없는 오류가 발생했습니다.'}
            </p>
            <Link
              href="/login"
              className="text-gray-400 hover:text-gray-300 text-xs underline"
            >
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

