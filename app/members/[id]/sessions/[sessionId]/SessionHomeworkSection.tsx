'use client';

import { updateSessionHomework } from './actions';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import FeedbackInput from '@/app/components/FeedbackInput';

export default function SessionHomeworkSection({ session }: { session: any }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [showInput, setShowInput] = useState(!session.homework);

  return (
    <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
      <h2 className="text-sm font-bold text-white mb-2">오늘의 과제</h2>
      {session.homework && !showInput && (
        <div>
          <div className="text-gray-300 whitespace-pre-wrap bg-black p-2 rounded text-xs mb-2">
            {session.homework.startsWith('<img') ? (
              <div 
                dangerouslySetInnerHTML={{ __html: session.homework }}
                className="[&_img]:max-w-full [&_img]:h-auto [&_img]:bg-white [&_img]:rounded"
              />
            ) : (
              <div>{session.homework}</div>
            )}
          </div>
          <button
            onClick={() => setShowInput(true)}
            className="text-gray-400 hover:text-gray-300 text-xs transition-colors"
          >
            수정하기
          </button>
        </div>
      )}
      {showInput && (
        <FeedbackInput
          initialFeedback={session.homework}
          onSave={async (formData) => {
            await updateSessionHomework(session.id, formData);
            setShowInput(false);
          }}
          placeholder="오늘의 과제를 입력하세요..."
        />
      )}
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
