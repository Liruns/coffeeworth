// src/app/api/payments/confirm/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { confirmPayment } from '@/lib/payment';
import { PLATFORM_FEE_RATE, PG_FEE_RATE } from '@/constants';

// POST /api/payments/confirm - 결제 승인
export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: '필수 정보가 누락되었습니다' },
        },
        { status: 400 }
      );
    }

    // Support 조회
    const support = await prisma.support.findUnique({
      where: { orderId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            emailNotify: true,
          },
        },
      },
    });

    if (!support) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '주문을 찾을 수 없습니다' } },
        { status: 404 }
      );
    }

    // 이미 완료된 결제인지 확인
    if (support.status === 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: '이미 완료된 결제입니다' } },
        { status: 400 }
      );
    }

    // 금액 검증
    if (support.amount !== amount) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: '금액이 일치하지 않습니다' } },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 승인
    const paymentResult = await confirmPayment(paymentKey, orderId, amount);

    if (!paymentResult.success) {
      await prisma.support.update({
        where: { id: support.id },
        data: { status: 'FAILED' },
      });
      return NextResponse.json(
        { success: false, error: { code: 'PAYMENT_FAILED', message: paymentResult.message } },
        { status: 400 }
      );
    }

    // 수수료 계산
    const platformFee = Math.round(amount * PLATFORM_FEE_RATE);
    const pgFee = Math.round(amount * PG_FEE_RATE);
    const netAmount = amount - platformFee - pgFee;

    // Support 업데이트
    const updatedSupport = await prisma.support.update({
      where: { id: support.id },
      data: {
        paymentKey,
        paymentMethod: paymentResult.method,
        status: 'COMPLETED',
        paidAt: new Date(),
        platformFee,
        pgFee,
        netAmount,
      },
    });

    // TODO: 크리에이터에게 알림 이메일 발송

    return NextResponse.json({
      success: true,
      data: {
        supportId: updatedSupport.id,
        creatorUsername: support.creator.username,
      },
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
