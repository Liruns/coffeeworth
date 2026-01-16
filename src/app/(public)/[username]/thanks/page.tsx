'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Coffee, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/public-layout';
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

          await fetchSupport(data.data.supportId);
        } catch {
          toast.error('결제 처리 중 오류가 발생했습니다');
        } finally {
          setIsConfirming(false);
        }
      } else if (supportId) {
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
        // Ignore fetch errors
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
        // Share cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('링크가 복사되었습니다');
    }
  };

  if (isLoading || isConfirming) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">
          {isConfirming ? '결제를 처리하고 있습니다...' : '로딩 중...'}
        </p>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto border shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="pt-12 pb-6 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle className="h-10 w-10" />
        </div>
        <CardTitle className="text-2xl font-bold">후원 완료!</CardTitle>
        <CardDescription className="text-base font-medium">
          따뜻한 마음이 성공적으로 전달되었습니다
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-12 space-y-8">
        {support && (
          <div className="bg-muted/30 rounded-xl p-8 text-center border">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-4">
              <span>{DEFAULT_COFFEE_EMOJI}</span>
              <span>x {support.coffeeCount}</span>
            </div>
            
            <p className="text-3xl font-bold mb-2">
              {support.amount.toLocaleString()}원
            </p>
            
            <p className="text-muted-foreground font-medium">
              {support.creatorName}님에게<br />큰 응원이 되었습니다
            </p>

            {support.message && (
              <div className="mt-6 p-4 bg-background rounded-lg border text-sm text-left italic text-muted-foreground leading-relaxed">
                "{support.message}"
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleShare} 
            variant="outline" 
            className="w-full h-12 rounded-xl font-bold"
          >
            <Share2 className="mr-2 h-5 w-5" />
            공유하기
          </Button>
          <Button asChild className="w-full h-12 rounded-xl font-bold bg-[#FFDD00] text-black hover:bg-[#E5C700]">
            <Link href={`/${username}`}>
              <Coffee className="mr-2 h-5 w-5" />
              크리에이터 페이지로
            </Link>
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {APP_NAME}를 이용해주셔서 감사합니다 ☕
        </p>
      </CardContent>
    </Card>
  );
}

export default function ThanksPage() {
  return (
    <PublicLayout centered maxWidth="sm">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <ThanksContent />
      </Suspense>
    </PublicLayout>
  );
}
