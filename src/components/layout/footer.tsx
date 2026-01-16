import Link from 'next/link';
import { Coffee } from 'lucide-react';
import { APP_NAME } from '@/constants';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:px-6 md:flex-row md:py-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 md:flex-row md:gap-2">
          <Coffee className="h-5 w-5 text-[#FFDD00]" aria-hidden="true" />
          <p className="text-center text-sm leading-loose md:text-left">
            Powered by{' '}
            <Link href="/" className="font-medium underline underline-offset-4 transition-colors hover:text-[#6F4E37]">
              {APP_NAME}
            </Link>
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground sm:gap-6" aria-label="푸터 내비게이션">
          <Link href="/terms" className="transition-colors hover:text-foreground hover:underline underline-offset-4">
            이용약관
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground hover:underline underline-offset-4">
            개인정보처리방침
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground hover:underline underline-offset-4">
            문의하기
          </Link>
        </nav>
      </div>
    </footer>
  );
}
