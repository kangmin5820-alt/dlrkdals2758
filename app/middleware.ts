import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('pt-trainer-auth');
  const isAuthenticated = authCookie?.value === 'authenticated';
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === '/login';
  const isRootPage = pathname === '/';

  // 루트 페이지 처리
  if (isRootPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/members', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 로그인 페이지에 이미 인증된 사용자가 접근하면 회원 목록으로 리다이렉트
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/members', request.url));
  }

  // 로그인 페이지가 아니고 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isLoginPage && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청 경로와 일치:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public 폴더의 파일들
     * - .ico, .png, .jpg, .jpeg, .gif, .svg 등 이미지 파일
     */
    '/',
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)).*)',
  ],
};

