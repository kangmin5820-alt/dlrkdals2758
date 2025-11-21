import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Suspense } from 'react';
import LogoutButton from '@/app/components/LogoutButton';

async function MembersList({ searchQuery }: { searchQuery?: string }) {
  const members = await prisma.member.findMany({
    where: searchQuery
      ? {
          name: {
            contains: searchQuery,
          },
        }
      : undefined,
    include: {
      sessions: {
        orderBy: {
          date: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
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
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const searchQuery = searchParams.q;

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
}

