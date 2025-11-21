import { updateMemberBasicInfo } from '@/app/members/[id]/actions';
import { Member } from '@prisma/client';

export default function BasicInfoTab({ member }: { member: Member }) {
  return (
    <form action={updateMemberBasicInfo.bind(null, member.id)} style={{ pointerEvents: 'auto' }}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              키 (cm)
            </label>
            <input
              type="number"
              step="0.1"
              name="heightCm"
              defaultValue={member.heightCm || ''}
              className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
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
              defaultValue={member.weightKg || ''}
              className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
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
            defaultValue={member.goalWeightKg || ''}
            className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
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
              defaultValue={member.bodyFatPct || ''}
              className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
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
              defaultValue={member.goalBodyFatPct || ''}
              className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
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
              defaultValue={member.skeletalMuscleKg || ''}
              className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
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
              defaultValue={member.goalSkeletalMuscleKg || ''}
              className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
            />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
          <button
            type="submit"
            onClick={(e) => {
              console.log('저장 버튼 클릭');
            }}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded transition-colors cursor-pointer font-semibold text-xs border border-white/10"
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
          >
            저장
          </button>
        </div>
      </div>
    </form>
  );
}
