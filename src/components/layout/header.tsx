'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Coffee, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/constants';

export function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg transition-opacity hover:opacity-80">
          <Coffee className="h-5 w-5 text-[#FFDD00]" aria-hidden="true" />
          <span>{APP_NAME}</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3" aria-label="주요 내비게이션">
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : session ? (
            <Button asChild>
              <Link href="/dashboard">대시보드</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/login">시작하기</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
