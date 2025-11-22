import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SessionNoteSection from './SessionNoteSection';
import SessionHomeworkSection from './SessionHomeworkSection';
import ExerciseList from './ExerciseList';

// 동적 렌더링 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PTSessionDetailPage({
  params,
}: {
  params: { id: string; sessionId: string };
}) {
  const sessionId = parseInt(params.sessionId);
  const memberId = parseInt(params.id);

  const session = await prisma.pTSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      memberId: true,
      sessionNumber: true,
      date: true,
      note: true,
      homework: true,
      createdAt: true,
      member: {
        select: {
          id: true,
          name: true,
        },
      },
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
  });

  if (!session || session.memberId !== memberId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black p-3">
      <div className="max-w-7xl mx-auto">
        <div className="mb-3">
          <Link
            href={`/members/${memberId}`}
            className="text-gray-400 hover:text-gray-300 mb-2 inline-flex items-center gap-1 transition-colors group text-xs"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>회원 상세로</span>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-0.5">
                PT {session.sessionNumber}회차
              </h1>
              <p className="text-gray-500 text-xs">
                {new Date(session.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <ExerciseList session={session} />
          <SessionNoteSection session={session} />
          <SessionHomeworkSection session={session} />
        </div>
      </div>
    </div>
  );
}
