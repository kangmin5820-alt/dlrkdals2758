'use client';

import { createPTSession } from '@/app/members/[id]/actions';
import { Member, PTSession } from '@prisma/client';
import Link from 'next/link';
import DeleteSessionButton from './DeleteSessionButton';

type SessionWithDetails = PTSession & {
  exercises: {
    id: number;
    name: string;
    feedback: string | null;
    sets: {
      id: number;
      setNumber: number;
      weightKg: number | null;
      reps: number | null;
      rir: number | null;
      record: string | null;
      volume: number | null;
      restSec: number | null;
      memo: string | null;
    }[];
  }[];
};

type MemberWithSessions = Member & {
  sessions: SessionWithDetails[];
};

export default function PTSessionTab({
  member,
}: {
  member: MemberWithSessions;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-white">PT 세션 목록</h3>
        <form action={createPTSession.bind(null, member.id)}>
          <button
            type="submit"
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors cursor-pointer font-semibold text-xs border border-white/10"
            style={{ pointerEvents: 'auto' }}
          >
            + 새 세션
          </button>
        </form>
      </div>

      {member.sessions.length === 0 ? (
        <div className="text-center py-6 bg-[#111111] rounded border border-[#1a1a1a]">
          <p className="text-gray-500 text-xs">PT 세션이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {member.sessions.map((session) => (
            <div
              key={session.id}
              className="border border-[#1a1a1a] rounded p-3 bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-base font-bold text-white mb-0.5">
                    PT {session.sessionNumber}회
                  </h4>
                  <p className="text-xs text-gray-500">
                    {new Date(session.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/members/${member.id}/sessions/${session.id}`}
                    className="text-gray-400 hover:text-gray-300 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 group"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <span>상세</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                  <DeleteSessionButton sessionId={session.id} sessionNumber={session.sessionNumber} />
                </div>
              </div>

              {/* 오늘의 메모 */}
              {session.note && (
                <div className="mb-2 p-2 bg-white/5 border border-white/10 rounded">
                  <p className="text-xs font-semibold text-gray-400 mb-1">
                    오늘의 메모
                  </p>
                  <p className="text-xs text-gray-300 whitespace-pre-wrap">
                    {session.note}
                  </p>
                </div>
              )}

              {/* 오늘의 과제 */}
              {session.homework && (
                <div className="mb-2 p-2 bg-white/5 border border-white/10 rounded">
                  <p className="text-xs font-semibold text-gray-400 mb-1">
                    오늘의 과제
                  </p>
                  <p className="text-xs text-gray-300 whitespace-pre-wrap">
                    {session.homework}
                  </p>
                </div>
              )}

              {/* 운동 목록 */}
              {session.exercises.length === 0 ? (
                <p className="text-gray-500 text-xs">운동 기록이 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {session.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="border border-[#1a1a1a] rounded p-2 bg-[#0a0a0a]"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h5 className="font-bold text-sm text-white">
                          {exercise.name}
                        </h5>
                        {exercise.feedback && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 bg-[#111111] px-1.5 py-0.5 rounded">
                              피드백 있음
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 피드백 */}
                      {exercise.feedback && (
                        <div className="mb-1.5 p-1.5 bg-[#111111] rounded border border-[#1a1a1a]">
                          <p className="text-xs font-semibold text-gray-500 mb-0.5">
                            피드백:
                          </p>
                          <p className="text-xs text-gray-300 whitespace-pre-wrap">
                            {exercise.feedback}
                          </p>
                        </div>
                      )}

                      {/* 세트 목록 */}
                      {exercise.sets.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs">
                            <thead className="bg-black">
                              <tr>
                                <th className="px-1.5 py-1 text-left text-xs font-semibold text-gray-400">
                                  세트
                                </th>
                                <th className="px-1.5 py-1 text-left text-xs font-semibold text-gray-400">
                                  무게
                                </th>
                                <th className="px-1.5 py-1 text-left text-xs font-semibold text-gray-400">
                                  횟수
                                </th>
                                <th className="px-1.5 py-1 text-left text-xs font-semibold text-gray-400">
                                  RIR
                                </th>
                                <th className="px-1.5 py-1 text-left text-xs font-semibold text-gray-400">
                                  볼륨
                                </th>
                                <th className="px-1.5 py-1 text-left text-xs font-semibold text-gray-400">
                                  휴식
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-[#0a0a0a] divide-y divide-[#1a1a1a]">
                              {exercise.sets.map((set) => (
                                <tr key={set.id} className="hover:bg-[#111111]">
                                  <td className="px-1.5 py-1 text-xs text-gray-400 font-medium">
                                    {set.setNumber}세트
                                  </td>
                                  <td className="px-1.5 py-1 text-xs text-gray-400">
                                    {set.weightKg ? `${set.weightKg}kg` : '-'}
                                  </td>
                                  <td className="px-1.5 py-1 text-xs text-gray-400">
                                    {set.reps || '-'}
                                  </td>
                                  <td className="px-1.5 py-1 text-xs text-gray-400">
                                    {set.rir !== null ? set.rir : '-'}
                                  </td>
                                  <td className="px-1.5 py-1 text-xs text-gray-400">
                                    {set.volume ? set.volume : '-'}
                                  </td>
                                  <td className="px-1.5 py-1 text-xs text-gray-400">
                                    {set.restSec ? `${set.restSec}초` : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
