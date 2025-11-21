import { updateMemberMemo } from '@/app/members/[id]/actions';
import { Member } from '@prisma/client';

export default function MemoTab({ member }: { member: Member }) {
  return (
    <form action={updateMemberMemo.bind(null, member.id)} style={{ pointerEvents: 'auto' }}>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">
          상세 메모
        </label>
        <textarea
          name="memo"
          rows={20}
          defaultValue={member.memo || ''}
          className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white text-xs placeholder-gray-600 transition-all resize-none"
          placeholder="회원에 대한 상세 메모를 입력하세요..."
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
    </form>
  );
}
