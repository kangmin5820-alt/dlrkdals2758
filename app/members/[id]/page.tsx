import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MemberTabs from './MemberTabs';
import DeleteMemberButton from './DeleteMemberButton';

// 동적 렌더링 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MemberDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const memberId = parseInt(params.id);
  
  try {
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

    // dietGuide는 선택적으로 조회 (테이블이 없을 수 있음)
    let dietGuide = null;
    try {
      dietGuide = await prisma.dietGuide.findUnique({
        where: { memberId },
        include: {
          meals: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
    } catch (dietError: any) {
      // dietGuide 테이블이 없거나 레코드가 없으면 null로 처리
      // P2025: Record not found, P2001: Table does not exist
      if (dietError?.code === 'P2001' || dietError?.message?.includes('does not exist') || dietError?.message?.includes('relation')) {
        // 테이블이 없는 경우 - 조용히 무시
        dietGuide = null;
      } else if (dietError?.code !== 'P2025') {
        // 다른 에러인 경우에만 로그
        console.warn('DietGuide 조회 실패:', dietError?.message || dietError);
      }
    }

    // member 객체에 dietGuide 추가
    const memberWithDietGuide = {
      ...member,
      dietGuide,
    };

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
            <MemberTabs member={memberWithDietGuide} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('회원 상세 정보 조회 오류:', error);
    return (
      <div className="min-h-screen bg-black p-3">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-400 text-sm mb-4">
              회원 정보를 불러오는 중 오류가 발생했습니다.
            </p>
            <Link
              href="/members"
              className="text-gray-400 hover:text-gray-300 text-xs underline"
            >
              회원 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

