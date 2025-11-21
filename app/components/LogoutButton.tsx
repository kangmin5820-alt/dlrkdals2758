'use client';

import { logout } from '@/app/logout/actions';
import { useState } from 'react';

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="bg-[#1a0a0a] hover:bg-[#2a0a0a] text-gray-400 hover:text-gray-300 px-3 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold border border-[#2a1a1a]"
    >
      {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
    </button>
  );
}

