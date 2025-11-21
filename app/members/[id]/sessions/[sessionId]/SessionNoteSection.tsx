import { updateSessionNote } from './actions';

export default function SessionNoteSection({ session }: { session: any }) {
  return (
    <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
      <h2 className="text-sm font-bold text-white mb-2">오늘의 메모</h2>
      <form action={updateSessionNote.bind(null, session.id)}>
        <textarea
          name="note"
          rows={10}
          defaultValue={session.note || ''}
          className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-xs transition-all resize-none"
          placeholder="오늘의 메모를 입력하세요..."
        />
        <div className="mt-2">
          <button
            type="submit"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded transition-colors text-xs font-semibold border border-white/10"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
