'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h2>
        <p className="text-gray-600 mb-6">{error.message || '알 수 없는 오류가 발생했습니다.'}</p>
        <button
          onClick={() => reset()}
          className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition border border-white/10"
        >
          다시 시도
        </button>
        <Link
          href="/members"
          className="w-full mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition block text-center"
        >
          회원 목록으로
        </Link>
      </div>
    </div>
  );
}

