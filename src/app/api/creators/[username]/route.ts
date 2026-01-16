// src/app/api/creators/[username]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ username: string }>;
}

// GET /api/creators/[username] - 크리에이터 공개 프로필 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { username } = await params;

    const creator = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        coffeePrice: true,
        themeColor: true,
        socialLinks: true,
        isPublic: true,
        _count: {
          select: {
            supports: {
              where: { status: 'COMPLETED' },
            },
          },
        },
      },
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

    // 총 커피 수 계산
    const coffeeStats = await prisma.support.aggregate({
      where: {
        creatorId: creator.id,
        status: 'COMPLETED',
      },
      _sum: {
        coffeeCount: true,
      },
    });

    // 최근 후원 목록 (공개된 것만)
    const recentSupports = await prisma.support.findMany({
      where: {
        creatorId: creator.id,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        supporterName: true,
        coffeeCount: true,
        message: true,
        isAnonymous: true,
        paidAt: true,
      },
      orderBy: { paidAt: 'desc' },
      take: 10,
    });

    // 민감한 정보 제거
    const publicSupports = recentSupports.map((s: typeof recentSupports[number]) => ({
      id: s.id,
      supporterName: s.isAnonymous ? '익명' : (s.supporterName || '익명'),
      coffeeCount: s.coffeeCount,
      message: s.isAnonymous ? null : s.message,
      paidAt: s.paidAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        id: creator.id,
        name: creator.name,
        username: creator.username,
        image: creator.image,
        bio: creator.bio,
        coffeePrice: creator.coffeePrice,
        themeColor: creator.themeColor,
        socialLinks: creator.socialLinks,
        totalSupporters: creator._count.supports,
        totalCoffees: coffeeStats._sum.coffeeCount || 0,
        recentSupports: publicSupports,
      },
    });
  } catch (error) {
    console.error('Get creator error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
