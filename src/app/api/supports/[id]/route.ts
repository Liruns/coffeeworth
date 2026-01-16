// src/app/api/supports/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/supports/[id] - 후원 정보 조회 (공개 정보만)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const support = await prisma.support.findUnique({
      where: { id },
      select: {
        id: true,
        supporterName: true,
        coffeeCount: true,
        amount: true,
        message: true,
        isAnonymous: true,
        status: true,
        paidAt: true,
        creator: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    if (!support) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '후원 정보를 찾을 수 없습니다' } },
        { status: 404 }
      );
    }

    // 완료된 후원만 조회 가능
    if (support.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: '조회할 수 없는 후원입니다' } },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        supporterName: support.isAnonymous ? '익명' : (support.supporterName || '익명'),
        coffeeCount: support.coffeeCount,
        amount: support.amount,
        message: support.isAnonymous ? null : support.message,
        creatorName: support.creator.name || support.creator.username,
        creatorUsername: support.creator.username,
        paidAt: support.paidAt,
      },
    });
  } catch (error) {
    console.error('Get support error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
