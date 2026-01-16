'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Coffee, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { APP_NAME } from '@/constants';

// 서버에서 환경변수를 가져오기 위한 API 호출 대신, 클라이언트에서 providers를 체크
const isDevMode = process.env.NODE_ENV === 'development';

function LoginForm() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleKakaoLogin = async () => {
    setIsLoading('kakao');
    await signIn('kakao', { callbackUrl });
  };

  const handleDevLogin = async () => {
    if (!email) return;
    setIsLoading('dev');
    await signIn('dev-login', { email, callbackUrl });
  };

  return (
    <div className="space-y-4">
      {/* 카카오 로그인 */}
      <Button
        className="w-full bg-[#FFDD00] text-black hover:bg-[#E5C700] h-11 rounded-lg font-bold"
        onClick={handleKakaoLogin}
        disabled={isLoading !== null}
      >
        {isLoading === 'kakao' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg
            className="mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3C6.477 3 2 6.463 2 10.714c0 2.683 1.763 5.037 4.402 6.388-.155.579-.997 3.734-1.03 3.964 0 0-.02.166.088.23.107.063.236.012.236.012.311-.044 3.613-2.37 4.186-2.773.702.102 1.43.155 2.118.155 5.523 0 10-3.463 10-7.714S17.523 3 12 3z" />
          </svg>
        )}
        카카오로 시작하기
      </Button>

      {/* 개발용 로그인 (개발 모드에서만 표시) */}
      {isDevMode && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                개발용 로그인
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDevLogin()}
              className="h-11 rounded-lg"
            />
            <Button
              variant="outline"
              className="w-full h-11 rounded-lg"
              onClick={handleDevLogin}
              disabled={isLoading !== null || !email}
            >
              {isLoading === 'dev' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              이메일로 테스트 로그인
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              * 개발 환경에서만 표시됩니다
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function LoginFormSkeleton() {
  return <Skeleton className="h-10 w-full" />;
}

export default function LoginPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center bg-[#FFF8E7]/30 dark:bg-background">
      <Card className="w-full max-w-md rounded-xl border shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDD00]/20">
            <Coffee className="h-8 w-8 text-[#6F4E37]" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">{APP_NAME}</CardTitle>
          <CardDescription className="text-base">
            크리에이터를 위한 따뜻한 후원 플랫폼
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
          <p className="text-center text-xs text-muted-foreground">
            로그인하면 {APP_NAME}의{' '}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              이용약관
            </a>{' '}
            및{' '}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              개인정보처리방침
            </a>
            에 동의하게 됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
