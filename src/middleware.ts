// src/middleware.ts

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// 인증이 필요한 경로
const protectedRoutes = ['/dashboard'];

// 인증된 사용자가 접근하면 안 되는 경로
const authRoutes = ['/login'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // 보호된 경로에 미인증 사용자 접근 시 로그인 페이지로 리다이렉트
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 인증 페이지에 로그인된 사용자 접근 시 대시보드로 리다이렉트
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // 인증이 필요한 경로
    '/dashboard/:path*',
    // 인증 페이지
    '/login',
    // API 경로 중 보호가 필요한 경로
    '/api/me/:path*',
  ],
};
