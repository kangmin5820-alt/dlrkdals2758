'use client';

import { login } from './actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/members');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-[#1a0a0a] border border-[#2a1a1a] rounded text-gray-400 text-xs">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">
          아이디
        </label>
        <input
          type="text"
          name="username"
          required
          className="w-full px-3 py-2 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-sm transition-all"
          placeholder="아이디를 입력하세요"
          autoComplete="username"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">
          비밀번호
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full px-3 py-2 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white placeholder-gray-600 text-sm transition-all"
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm border border-white/10"
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}

