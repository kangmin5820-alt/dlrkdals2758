'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">심각한 오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-6">{error.message || '알 수 없는 오류가 발생했습니다.'}</p>
            <button
              onClick={() => reset()}
              className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition border border-white/10"
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

