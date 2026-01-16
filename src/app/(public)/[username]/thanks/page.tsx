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
    <div className="relative min-h-screen bg-[#FFF8E7]/40 dark:bg-zinc-950 overflow-hidden px-4">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[#FFDD00]/10 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[#6F4E37]/5 blur-[100px] -z-10" />

      <div className="container max-w-lg py-16 md:py-32 relative z-10">
        <Card className="text-center rounded-[3rem] border-4 border-white dark:border-zinc-800 shadow-[0_30px_70px_rgba(0,0,0,0.12)] overflow-hidden bg-white/90 backdrop-blur-xl dark:bg-zinc-900/90 animate-in zoom-in-95 duration-700">
          <div className="h-4 bg-gradient-to-r from-[#FFDD00] via-[#E5C700] to-[#FFDD00]" />
          
          <CardHeader className="pt-16 pb-8">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#FFDD00] shadow-[0_15px_30px_rgba(255,221,0,0.4)] animate-bounce duration-[2000ms]">
              <CheckCircle className="h-12 w-12 text-black fill-black/10" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-4xl font-black tracking-tight text-[#6F4E37] dark:text-[#FFDD00]">후원 완료!</CardTitle>
              <CardDescription className="text-lg font-bold text-muted-foreground italic">
                따뜻한 마음이 성공적으로 전달되었습니다
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-10 px-8 md:px-12 pb-16">
            {support && (
              <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#FFF8E7] to-[#FFF1C1] dark:from-zinc-800 dark:to-zinc-900 p-10 border-2 border-[#FFDD00]/30 shadow-inner group transition-all hover:shadow-md">
                <div className="absolute top-4 right-4 text-[#FFDD00]/20 font-black text-6xl italic select-none">Receipt</div>
                
                <div className="flex flex-col items-center gap-2 mb-6">
                  <div className="flex items-center justify-center gap-3 text-4xl">
                    <span className="animate-pulse">{DEFAULT_COFFEE_EMOJI}</span>
                    <span className="font-black text-[#6F4E37] dark:text-foreground">x {support.coffeeCount}</span>
                  </div>
                  <div className="h-1 w-20 bg-[#6F4E37]/10 rounded-full" />
                </div>
                
                <p className="text-5xl font-black text-[#6F4E37] dark:text-[#FFDD00] tracking-tighter">
                  {support.amount.toLocaleString()}원
                </p>
                
                <p className="mt-4 text-lg font-bold text-[#6F4E37]/70 dark:text-muted-foreground leading-relaxed">
                  {support.creatorName}님에게<br />큰 창작의 힘이 되었습니다
                </p>

                {support.message && (
                  <div className="mt-8 relative p-6 bg-white/50 dark:bg-black/20 rounded-2xl border border-white dark:border-zinc-700 italic">
                    <p className="text-lg font-medium text-foreground/80 leading-relaxed">
                      "{support.message}"
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleShare} 
                variant="outline" 
                className="w-full h-16 rounded-2xl border-2 font-black text-lg transition-all hover:bg-[#FFF8E7] dark:hover:bg-zinc-800 hover:border-[#FFDD00]/50 active:scale-95"
              >
                <Share2 className="mr-3 h-6 w-6 text-[#6F4E37] dark:text-[#FFDD00]" />
                이 소식을 친구들에게 공유하기
              </Button>
              <Button asChild className="w-full h-20 rounded-2xl text-xl font-black bg-[#FFDD00] text-black hover:bg-[#E5C700] shadow-[0_15px_30px_rgba(255,221,0,0.3)] transition-all hover:-translate-y-1 active:scale-95">
                <Link href={`/${username}`}>
                  <Coffee className="mr-3 h-8 w-8 fill-black/10" />
                  크리에이터 페이지로 돌아가기
                </Link>
              </Button>
            </div>

            <p className="text-sm font-black text-muted-foreground/60 tracking-widest uppercase">
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
