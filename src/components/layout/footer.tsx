import Link from 'next/link';
import { Coffee } from 'lucide-react';
import { APP_NAME } from '@/constants';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Coffee className="h-5 w-5 text-[#FFDD00]" />
          <p className="text-center text-sm leading-loose md:text-left">
            Powered by{' '}
            <Link href="/" className="font-medium underline underline-offset-4">
              {APP_NAME}
            </Link>
          </p>
        </div>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:underline underline-offset-4">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:underline underline-offset-4">
            개인정보처리방침
          </Link>
          <Link href="/contact" className="hover:underline underline-offset-4">
            문의하기
          </Link>
        </nav>
      </div>
    </footer>
  );
}
