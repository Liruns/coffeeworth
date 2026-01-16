'use client';

import { useEffect, useRef, useState } from 'react';
import { loadTossPayments, TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME, APP_URL } from '@/constants';

interface PaymentButtonProps {
  orderId: string;
  orderName: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  creatorUsername: string;
  supportId: string;
  themeColor?: string;
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

export function PaymentButton({
  orderId,
  orderName,
  amount,
  customerName,
  customerEmail,
  creatorUsername,
  supportId,
  themeColor = '#FFDD00',
}: PaymentButtonProps) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);

  useEffect(() => {
    async function initPayment() {
      if (!clientKey) {
        console.error('Toss client key not found');
        return;
      }

      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey: 'ANONYMOUS' });
        
        await widgets.setAmount({
          currency: 'KRW',
          value: amount,
        });

        // 결제 방법 위젯 렌더링
        await widgets.renderPaymentMethods({
          selector: '#payment-methods',
          variantKey: 'DEFAULT',
        });

        // 약관 위젯 렌더링
        await widgets.renderAgreement({
          selector: '#payment-agreement',
          variantKey: 'AGREEMENT',
        });

        widgetsRef.current = widgets;
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize payment:', error);
      }
    }

    initPayment();
  }, [amount]);

  const handlePayment = async () => {
    if (!widgetsRef.current) return;

    setIsLoading(true);

    try {
      await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        customerName: customerName || '익명',
        customerEmail: customerEmail || undefined,
        successUrl: `${APP_URL}/${creatorUsername}/thanks?supportId=${supportId}`,
        failUrl: `${APP_URL}/${creatorUsername}?error=payment_failed`,
      });
    } catch (error) {
      console.error('Payment request failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 결제 방법 선택 */}
      <div id="payment-methods" className="min-h-[200px]" />
      
      {/* 약관 동의 */}
      <div id="payment-agreement" />

      {/* 결제 버튼 */}
      <Button
        onClick={handlePayment}
        disabled={!isReady || isLoading}
        className="w-full text-lg py-6"
        style={{ backgroundColor: themeColor }}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : null}
        {amount.toLocaleString()}원 결제하기
      </Button>
    </div>
  );
}
