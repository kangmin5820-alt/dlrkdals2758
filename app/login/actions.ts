'use server';

import { verifyCredentials, setAuthCookie } from '@/lib/auth';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: '아이디와 비밀번호를 입력해주세요.' };
  }

  if (!verifyCredentials(username, password)) {
    return { error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
  }

  await setAuthCookie();
  return { success: true };
}

