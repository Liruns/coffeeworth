// src/lib/payment.ts

const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments';

interface ConfirmPaymentResult {
  success: boolean;
  message?: string;
  method?: string;
  approvedAt?: string;
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<ConfirmPaymentResult> {
  const secretKey = process.env.TOSS_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      message: '결제 설정이 완료되지 않았습니다',
    };
  }

  const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

  try {
    const response = await fetch(`${TOSS_API_URL}/confirm`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || '결제 승인에 실패했습니다',
      };
    }

    return {
      success: true,
      method: data.method,
      approvedAt: data.approvedAt,
    };
  } catch (error) {
    console.error('Toss payment confirm error:', error);
    return {
      success: false,
      message: '결제 승인 중 오류가 발생했습니다',
    };
  }
}

// 결제 취소
export async function cancelPayment(
  paymentKey: string,
  cancelReason: string
): Promise<{ success: boolean; message?: string }> {
  const secretKey = process.env.TOSS_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      message: '결제 설정이 완료되지 않았습니다',
    };
  }

  const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

  try {
    const response = await fetch(`${TOSS_API_URL}/${paymentKey}/cancel`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cancelReason }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || '결제 취소에 실패했습니다',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Toss payment cancel error:', error);
    return {
      success: false,
      message: '결제 취소 중 오류가 발생했습니다',
    };
  }
}
