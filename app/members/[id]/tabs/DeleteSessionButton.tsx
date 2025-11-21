'use client';

import { deletePTSession } from '@/app/members/[id]/actions';
import { useState } from 'react';

export default function DeleteSessionButton({
  sessionId,
  sessionNumber,
}: {
  sessionId: number;
  sessionNumber: number;
}) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDelete() {
    setIsDeleting(true);
    deletePTSession(sessionId).catch((error) => {
      console.error('삭제 오류:', error);
      alert('PT 세션 삭제 중 오류가 발생했습니다.');
      setIsDeleting(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="text-gray-500 hover:text-gray-400 text-xs font-medium transition-colors px-2 py-1"
        style={{ pointerEvents: 'auto' }}
      >
        삭제
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-[#0a0a0a] rounded-xl p-6 max-w-md w-full mx-4 border border-[#1a1a1a] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">
              PT 세션 삭제 확인
            </h3>
            <p className="text-gray-300 mb-6">
              <span className="font-semibold text-gray-400">PT {sessionNumber}회</span>
              세션을 삭제하시겠습니까?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              이 작업은 되돌릴 수 없습니다. 해당 세션의 모든 운동 기록과 세트 정보가 함께 삭제됩니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
                className="px-5 py-2 border border-[#1a1a1a] rounded-lg text-gray-400 hover:bg-[#1a1a1a] transition disabled:opacity-50 text-sm font-medium"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-[#1a0a0a] hover:bg-[#2a0a0a] text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-[#2a1a1a]"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

