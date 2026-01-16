import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from '@/components/providers';
import { APP_NAME, APP_URL } from '@/constants';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - 한국 크리에이터를 위한 후원 플랫폼`,
    template: `%s | ${APP_NAME}`,
  },
  description: '개발자, 블로거, 크리에이터를 위한 간편 후원 서비스. 카카오페이, 토스로 커피 한 잔의 응원을 보내보세요.',
  keywords: ['후원', '크리에이터', '개발자', '블로거', '커피값', 'Buy Me a Coffee'],
  authors: [{ name: APP_NAME }],
  openGraph: {
    title: `${APP_NAME} - 한국 크리에이터를 위한 후원 플랫폼`,
    description: '개발자, 블로거, 크리에이터를 위한 간편 후원 서비스',
    url: APP_URL,
    siteName: APP_NAME,
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - 한국 크리에이터를 위한 후원 플랫폼`,
    description: '개발자, 블로거, 크리에이터를 위한 간편 후원 서비스',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <Providers>
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
