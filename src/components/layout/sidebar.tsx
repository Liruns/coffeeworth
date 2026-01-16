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
    <div className="flex flex-col h-full bg-background border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Coffee className="h-5 w-5 text-[#FFDD00]" />
          <span>{APP_NAME}</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-6 px-3">
        <nav className="space-y-1" aria-label="대시보드 메뉴">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#FFDD00]/10 text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-4 w-4', isActive ? 'text-[#6F4E37]' : 'text-muted-foreground')} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Avatar className="h-9 w-9 border shadow-sm">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback className="bg-[#FFDD00] text-black font-bold text-xs">
              {session?.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-xs font-bold text-foreground">
              {session?.user?.name || '크리에이터'}
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md hover:text-destructive"
            onClick={() => signOut({ callbackUrl: '/' })}
            aria-label="로그아웃"
          >
            <LogOut className="h-4 w-4" />
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
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Coffee className="h-5 w-5 text-[#FFDD00]" />
          <span>{APP_NAME}</span>
        </Link>
      </header>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex w-72 flex-col bg-background animate-in slide-in-from-left duration-300">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0" aria-label="데스크톱 사이드바">
        <div className="h-full">
          <NavContent />
        </div>
      </aside>
    </>
  );
}
