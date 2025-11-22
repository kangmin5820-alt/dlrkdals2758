'use client';

import { updateSessionHomework } from './actions';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionHomeworkSection({ session }: { session: any }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
      <h2 className="text-sm font-bold text-white mb-2">오늘의 과제</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          const formData = new FormData(e.currentTarget);
          startTransition(async () => {
            try {
              await updateSessionHomework(session.id, formData);
              router.refresh();
            } catch (err: any) {
              setError(err.message || '과제를 저장하는 중 오류가 발생했습니다.');
            }
          });
        }}
      >
        <textarea
          name="homework"
          rows={10}
          defaultValue={session.homework || ''}
          className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-xs transition-all resize-none"
          placeholder="오늘의 과제를 입력하세요..."
        />
        <div className="mt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded transition-colors text-xs font-semibold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? '저장 중...' : '저장'}
          </button>
          {error && (
            <p className="text-red-400 text-xs mt-1">{error}</p>
          )}
        </div>
      </form>
    </div>
  );
}
