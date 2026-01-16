// src/app/api/supports/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/prisma';
import { createSupportSchema } from '@/lib/validations/support';

// POST /api/supports - 후원 생성 (결제 전)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createSupportSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: firstError?.message || '유효성 검사에 실패했습니다',
          },
        },
        { status: 400 }
      );
    }

    const data = result.data;

    // 크리에이터 조회
    const creator = await prisma.user.findUnique({
      where: { username: data.creatorUsername },
      select: { id: true, name: true, username: true, coffeePrice: true, isPublic: true },
    });

    if (!creator) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '크리에이터를 찾을 수 없습니다' } },
        { status: 404 }
      );
    }

    if (!creator.isPublic) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: '비공개 페이지입니다' } },
        { status: 403 }
      );
    }

    const amount = creator.coffeePrice * data.coffeeCount;
    const orderId = `ORD_${Date.now()}_${nanoid(8)}`;

    // Support 레코드 생성 (결제 전 PENDING 상태)
    const support = await prisma.support.create({
      data: {
        creatorId: creator.id,
        coffeeCount: data.coffeeCount,
        unitPrice: creator.coffeePrice,
        amount,
        message: data.message || null,
        supporterName: data.supporterName || null,
        supporterEmail: data.supporterEmail || null,
        isAnonymous: data.isAnonymous,
        orderId,
        status: 'PENDING',
      },
    });

    const displayName = creator.name || creator.username || '크리에이터';

    return NextResponse.json({
      success: true,
      data: {
        supportId: support.id,
        orderId,
        amount,
        orderName: `${displayName}님에게 커피 ${data.coffeeCount}잔`,
        creatorName: displayName,
      },
    });
  } catch (error) {
    console.error('Create support error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
