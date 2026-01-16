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
    <>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 bg-white dark:bg-card">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <Coffee className="h-6 w-6 text-[#FFDD00] fill-[#FFDD00]" />
          <span>{APP_NAME}</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                  isActive
                    ? 'bg-[#FFDD00] text-black shadow-sm font-bold'
                    : 'text-muted-foreground hover:bg-[#FFF8E7] hover:text-[#6F4E37]'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive ? 'text-black' : '')} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4 bg-white dark:bg-card">
        <div className="flex items-center gap-3 p-2 rounded-xl border bg-muted/30">
          <Avatar className="h-10 w-10 border-2 border-[#FFDD00]">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback className="bg-[#FFDD00] text-black font-bold">
              {session?.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-bold">
              {session?.user?.name || '사용자'}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => signOut({ callbackUrl: '/' })}
            title="로그아웃"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
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
        >
          <X className="h-5 w-5" />
        </Button>
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-muted/40 lg:block lg:w-72">
        <div className="flex h-full flex-col">
          <NavContent />
        </div>
      </aside>
    </>
  );
}
