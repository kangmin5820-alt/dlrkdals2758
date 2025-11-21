import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">404</h2>
        <p className="text-gray-600 mb-6">페이지를 찾을 수 없습니다.</p>
        <Link
          href="/members"
          className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition border border-white/10"
        >
          회원 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

