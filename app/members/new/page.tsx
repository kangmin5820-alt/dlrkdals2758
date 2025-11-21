import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function createMember(formData: FormData) {
  'use server';

  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string | null;
  const heightCm = formData.get('heightCm')
    ? parseFloat(formData.get('heightCm') as string)
    : null;
  const weightKg = formData.get('weightKg')
    ? parseFloat(formData.get('weightKg') as string)
    : null;
  const goalWeightKg = formData.get('goalWeightKg')
    ? parseFloat(formData.get('goalWeightKg') as string)
    : null;
  const bodyFatPct = formData.get('bodyFatPct')
    ? parseFloat(formData.get('bodyFatPct') as string)
    : null;
  const goalBodyFatPct = formData.get('goalBodyFatPct')
    ? parseFloat(formData.get('goalBodyFatPct') as string)
    : null;
  const skeletalMuscleKg = formData.get('skeletalMuscleKg')
    ? parseFloat(formData.get('skeletalMuscleKg') as string)
    : null;
  const goalSkeletalMuscleKg = formData.get('goalSkeletalMuscleKg')
    ? parseFloat(formData.get('goalSkeletalMuscleKg') as string)
    : null;

  const member = await prisma.member.create({
    data: {
      name,
      phone: phone || null,
      heightCm,
      weightKg,
      goalWeightKg,
      bodyFatPct,
      goalBodyFatPct,
      skeletalMuscleKg,
      goalSkeletalMuscleKg,
    },
  });

  redirect(`/members/${member.id}`);
}

export default function NewMemberPage() {
  return (
    <div className="min-h-screen bg-black p-3">
      <div className="max-w-2xl mx-auto">
        <div className="mb-3">
          <Link
            href="/members"
            className="text-gray-400 hover:text-gray-300 mb-2 inline-flex items-center gap-1 transition-colors group text-xs"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>회원 목록으로</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-0.5">
            신규 회원 추가
          </h1>
          <p className="text-gray-500 text-xs">새로운 회원 정보를 입력하세요</p>
        </div>

        <form action={createMember} className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                이름 <span className="text-gray-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-xs transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                전화번호
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-xs transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  키 (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="heightCm"
                  className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-xs transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  현재 체중 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weightKg"
                  className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                목표 체중 (kg)
              </label>
              <input
                type="number"
                step="0.1"
                name="goalWeightKg"
                className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-xs transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  현재 체지방률 (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="bodyFatPct"
                  className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-xs transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  목표 체지방률 (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="goalBodyFatPct"
                  className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-xs transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  현재 골격근량 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="skeletalMuscleKg"
                  className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-xs transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  목표 골격근량 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="goalSkeletalMuscleKg"
                  className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-xs transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#1a1a1a] flex gap-2">
            <button
              type="submit"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded transition-colors font-semibold text-xs border border-white/10"
            >
              저장
            </button>
            <Link
              href="/members"
              className="bg-[#1a1a1a] text-gray-400 px-4 py-1.5 rounded hover:bg-[#2a2a2a] transition-colors font-semibold text-xs border border-[#1a1a1a]"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
