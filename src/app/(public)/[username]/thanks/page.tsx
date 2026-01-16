'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Coffee, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME, APP_URL, DEFAULT_COFFEE_EMOJI } from '@/constants';

interface SupportResult {
  supporterName: string;
  coffeeCount: number;
  amount: number;
  creatorName: string;
  creatorUsername: string;
  message: string | null;
}

function ThanksContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const [support, setSupport] = useState<SupportResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  const username = params.username as string;
  const supportId = searchParams.get('supportId');
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    async function confirmPayment() {
      // 결제 승인이 필요한 경우 (토스페이먼츠 리다이렉트)
      if (paymentKey && orderId && amount) {
        setIsConfirming(true);
        try {
          const res = await fetch('/api/payments/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentKey,
              orderId,
              amount: parseInt(amount, 10),
            }),
          });

          const data = await res.json();

          if (!data.success) {
            toast.error(data.error?.message || '결제 승인에 실패했습니다');
            return;
          }

          // 결제 성공 후 후원 정보 조회
          await fetchSupport(data.data.supportId);
        } catch {
          toast.error('결제 처리 중 오류가 발생했습니다');
        } finally {
          setIsConfirming(false);
        }
      } else if (supportId) {
        // 이미 승인된 결제인 경우
        await fetchSupport(supportId);
      }

      setIsLoading(false);
    }

    async function fetchSupport(id: string) {
      try {
        const res = await fetch(`/api/supports/${id}`);
        const data = await res.json();
        if (data.success) {
          setSupport(data.data);
        }
      } catch {
        // 후원 정보를 가져오지 못해도 감사 페이지는 표시
      }
    }

    confirmPayment();
  }, [paymentKey, orderId, amount, supportId]);

  const handleShare = async () => {
    const shareUrl = `${APP_URL}/${username}`;
    const shareText = `${support?.creatorName || username}님에게 커피를 선물했어요! ${DEFAULT_COFFEE_EMOJI}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${APP_NAME} - 후원 완료`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // 공유 취소
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('링크가 복사되었습니다');
    }
  };

  if (isLoading || isConfirming) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-4 text-muted-foreground">
            {isConfirming ? '결제를 처리하고 있습니다...' : '로딩 중...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]/30 dark:bg-background">
      <div className="container max-w-lg py-12 md:py-24">
        <Card className="text-center rounded-2xl border shadow-lg overflow-hidden">
          <div className="h-2 bg-[#FFDD00]" />
          <CardHeader className="pt-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFDD00]/20 animate-bounce">
              <CheckCircle className="h-10 w-10 text-[#6F4E37]" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-[#6F4E37]">후원 완료!</CardTitle>
            <CardDescription className="text-base font-medium">
              따뜻한 마음이 성공적으로 전달되었습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-10">
            {support && (
              <div className="rounded-2xl bg-white dark:bg-muted p-8 border border-[#FFDD00]/30 shadow-inner">
                <div className="flex items-center justify-center gap-2 text-3xl mb-4">
                  <span className="animate-pulse">{DEFAULT_COFFEE_EMOJI}</span>
                  <span className="font-bold">x {support.coffeeCount}</span>
                </div>
                <p className="text-4xl font-extrabold text-[#6F4E37] dark:text-[#FFDD00]">
                  {support.amount.toLocaleString()}원
                </p>
                <p className="mt-3 text-base font-semibold text-muted-foreground">
                  {support.creatorName}님에게 큰 힘이 됩니다
                </p>
                {support.message && (
                  <div className="mt-6 relative">
                    <div className="absolute -left-2 -top-2 text-4xl text-[#FFDD00]/20 font-serif">&ldquo;</div>
                    <p className="px-4 py-2 text-base italic text-foreground/80 leading-relaxed">
                      {support.message}
                    </p>
                    <div className="absolute -right-2 -bottom-2 text-4xl text-[#FFDD00]/20 font-serif">&rdquo;</div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleShare} 
                variant="outline" 
                className="w-full h-12 rounded-xl border-2 hover:bg-[#FFF8E7] transition-all"
              >
                <Share2 className="mr-2 h-5 w-5" />
                응원 공유하기
              </Button>
              <Button asChild className="w-full h-12 rounded-xl text-lg font-bold bg-[#FFDD00] text-black hover:bg-[#E5C700] shadow-md transition-all">
                <Link href={`/${username}`}>
                  <Coffee className="mr-2 h-5 w-5" />
                  크리에이터 페이지로 돌아가기
                </Link>
              </Button>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              {APP_NAME}를 이용해주셔서 감사합니다 ☕
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ThanksContent />
    </Suspense>
  );
}
