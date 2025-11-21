import { updateMemberLifestyle } from '@/app/members/[id]/actions';
import { Member } from '@prisma/client';

export default function LifestyleTab({ member }: { member: Member }) {
  return (
    <form action={updateMemberLifestyle.bind(null, member.id)} style={{ pointerEvents: 'auto' }}>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            수면시간 (시간)
          </label>
          <input
            type="number"
            step="0.5"
            name="sleepHours"
            defaultValue={member.sleepHours || ''}
            className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            직업
          </label>
          <input
            type="text"
            name="job"
            defaultValue={member.job || ''}
            className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            운동경험
          </label>
          <input
            type="text"
            name="exerciseLevel"
            placeholder="예: 초보, 중급, 상급 등"
            defaultValue={member.exerciseLevel || ''}
            className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            흡연
          </label>
          <input
            type="text"
            name="smoking"
            placeholder="예: 비흡연, 하루 1갑 등"
            defaultValue={member.smoking || ''}
            className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            음주
          </label>
          <input
            type="text"
            name="drinking"
            placeholder="예: 주 1회, 비음주 등"
            defaultValue={member.drinking || ''}
            className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
          />
        </div>

        <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
          <button
            type="submit"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded transition-colors cursor-pointer font-semibold text-xs border border-white/10"
            style={{ pointerEvents: 'auto' }}
          >
            저장
          </button>
        </div>
      </div>
    </form>
  );
}
