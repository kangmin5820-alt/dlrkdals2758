// 루트 경로는 미들웨어에서 처리되므로 이 페이지는 실행되지 않습니다.
// 하지만 안전을 위해 리다이렉트를 유지합니다.
import { redirect } from 'next/navigation';

export default function Home() {
  // 미들웨어가 먼저 실행되므로 이 코드는 실행되지 않을 가능성이 높습니다.
  // 하지만 미들웨어가 작동하지 않는 경우를 대비해 로그인 페이지로 리다이렉트합니다.
  redirect('/login');
}

