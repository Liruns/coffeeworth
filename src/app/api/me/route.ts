// src/app/api/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateProfileSchema } from '@/lib/validations/profile';

// GET /api/me - 내 프로필 조회
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다' } },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        coffeePrice: true,
        themeColor: true,
        socialLinks: true,
        bankCode: true,
        bankAccount: true,
        bankHolder: true,
        emailNotify: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '사용자를 찾을 수 없습니다' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}

// PATCH /api/me - 프로필 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);

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

    // socialLinks에서 빈 문자열 제거
    if (data.socialLinks) {
      const cleanedLinks: Record<string, string> = {};
      for (const [key, value] of Object.entries(data.socialLinks)) {
        if (value && value.trim() !== '') {
          cleanedLinks[key] = value;
        }
      }
      data.socialLinks = Object.keys(cleanedLinks).length > 0 ? cleanedLinks : undefined;
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        bio: data.bio,
        coffeePrice: data.coffeePrice,
        themeColor: data.themeColor,
        socialLinks: data.socialLinks,
        bankCode: data.bankCode,
        bankAccount: data.bankAccount,
        bankHolder: data.bankHolder,
        emailNotify: data.emailNotify,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        coffeePrice: true,
        themeColor: true,
        socialLinks: true,
        bankCode: true,
        bankAccount: true,
        bankHolder: true,
        emailNotify: true,
        isVerified: true,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
