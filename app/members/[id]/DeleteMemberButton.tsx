'use client';

import { deleteMember } from './actions';
import { useState } from 'react';

export default function DeleteMemberButton({
  memberId,
  memberName,
}: {
  memberId: number;
  memberName: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDelete() {
    setIsDeleting(true);
    deleteMember(memberId).catch((error) => {
      console.error('삭제 오류:', error);
      alert('회원 삭제 중 오류가 발생했습니다.');
      setIsDeleting(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="bg-[#1a0a0a] hover:bg-[#2a0a0a] text-gray-300 px-6 py-3 rounded-lg transition-colors cursor-pointer font-medium border border-[#2a1a1a]"
        style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
      >
        회원 삭제
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-[#0a0a0a] rounded-xl p-8 max-w-md w-full mx-4 border border-[#1a1a1a] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-4">
              회원 삭제 확인
            </h3>
            <p className="text-gray-300 mb-6">
              <span className="font-semibold text-gray-400">{memberName}</span>
              님의 모든 정보를 삭제하시겠습니까?
            </p>
            <p className="text-sm text-gray-500 mb-8">
              이 작업은 되돌릴 수 없습니다. 회원의 모든 PT 세션, 운동 기록,
              인바디 기록이 함께 삭제됩니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
                className="px-6 py-2 border border-[#1a1a1a] rounded-lg text-gray-400 hover:bg-[#1a1a1a] transition disabled:opacity-50 font-medium"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-[#1a0a0a] hover:bg-[#2a0a0a] text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-[#2a1a1a]"
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

