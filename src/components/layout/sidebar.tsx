'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  Coffee,
  Home,
  Users,
  Wallet,
  Link2,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/constants';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: '홈', icon: Home },
  { href: '/dashboard/supporters', label: '서포터', icon: Users },
  { href: '/dashboard/payouts', label: '정산', icon: Wallet },
  { href: '/dashboard/tools', label: '연동 도구', icon: Link2 },
  { href: '/dashboard/settings', label: '설정', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      <div className="flex h-20 items-center border-b px-6 bg-[#FFF8E7]/30 dark:bg-zinc-900/30">
        <Link href="/dashboard" className="flex items-center gap-3 font-black text-2xl tracking-tighter group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFDD00] shadow-md group-hover:rotate-12 transition-transform">
            <Coffee className="h-6 w-6 text-black fill-black/10" />
          </div>
          <span className="text-[#6F4E37] dark:text-[#FFDD00]">{APP_NAME}</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-8 px-4">
        <nav className="grid gap-2" aria-label="대시보드 메뉴">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-4 rounded-[1.25rem] px-4 py-3.5 transition-all duration-300 group',
                  isActive
                    ? 'bg-[#FFDD00] text-black shadow-[0_10px_20px_rgba(255,221,0,0.2)] font-black scale-105 z-10'
                    : 'text-muted-foreground hover:bg-[#FFF8E7] hover:text-[#6F4E37] dark:hover:bg-zinc-900 font-bold'
                )}
              >
                <item.icon className={cn('h-5 w-5 transition-transform group-hover:scale-110', isActive ? 'text-black' : 'text-muted-foreground/60')} aria-hidden="true" />
                <span className="text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t bg-[#FFF8E7]/10 dark:bg-zinc-900/20">
        <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-white dark:border-zinc-800 bg-white/50 dark:bg-zinc-900 shadow-sm">
          <Avatar className="h-12 w-12 border-2 border-[#FFDD00] shadow-md">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback className="bg-[#FFDD00] text-black font-black text-lg">
              {session?.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-black text-[#6F4E37] dark:text-foreground">
              {session?.user?.name || '크리에이터'}
            </p>
            <p className="truncate text-xs font-bold text-muted-foreground/70">
              {session?.user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={() => signOut({ callbackUrl: '/' })}
            aria-label="로그아웃"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <Coffee className="h-6 w-6 text-[#FFDD00] fill-[#FFDD00]" />
          <span>{APP_NAME}</span>
        </Link>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        aria-label="모바일 사이드바"
        aria-hidden={!mobileOpen}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background transition-transform lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => setMobileOpen(false)}
          aria-label="메뉴 닫기"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </Button>
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-muted/40 lg:block lg:w-72" aria-label="데스크톱 사이드바">
        <div className="flex h-full flex-col">
          <NavContent />
        </div>
      </aside>
    </>
  );
}
