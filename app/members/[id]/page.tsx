import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MemberTabs from './MemberTabs';
import DeleteMemberButton from './DeleteMemberButton';

export default async function MemberDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const memberId = parseInt(params.id);
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      sessions: {
        include: {
          exercises: {
            include: {
              sets: {
                orderBy: {
                  setNumber: 'asc',
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      },
      inbodyRecords: {
        orderBy: {
          date: 'desc',
        },
      },
    },
  });

  if (!member) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black p-3" style={{ position: 'relative', zIndex: 1 }}>
      <div className="max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
        <div className="mb-3">
          <Link
            href="/members"
            className="text-gray-400 hover:text-gray-300 mb-2 inline-flex items-center gap-1 transition-colors cursor-pointer group text-xs"
            style={{ pointerEvents: 'auto' }}
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>회원 목록으로</span>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-0.5">
                {member.name}
              </h1>
              <p className="text-gray-500 text-xs">회원 상세 정보</p>
            </div>
            <div style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}>
              <DeleteMemberButton memberId={member.id} memberName={member.name} />
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
          <MemberTabs member={member} />
        </div>
      </div>
    </div>
  );
}

