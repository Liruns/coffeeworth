// src/app/api/me/username/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateUsernameSchema } from '@/lib/validations/profile';

// PATCH /api/me/username - 사용자명 변경
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
    const result = updateUsernameSchema.safeParse(body);

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

    const { username } = result.data;

    // 예약어 체크
    const reservedUsernames = [
      'admin', 'api', 'dashboard', 'login', 'logout', 'signup', 'register',
      'settings', 'support', 'help', 'about', 'contact', 'terms', 'privacy',
      'coffeeworth', 'coffee', 'www', 'mail', 'email', 'test',
    ];

    if (reservedUsernames.includes(username.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'INVALID_USERNAME', message: '사용할 수 없는 사용자명입니다' },
        },
        { status: 400 }
      );
    }

    // 중복 체크
    const existing = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (existing && existing.id !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'DUPLICATE_USERNAME', message: '이미 사용 중인 사용자명입니다' },
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
      select: {
        id: true,
        username: true,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Update username error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}

// GET /api/me/username/check?username=xxx - 사용자명 중복 체크
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: '사용자명을 입력해주세요' } },
        { status: 400 }
      );
    }

    const result = updateUsernameSchema.safeParse({ username });
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

    const existing = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    return NextResponse.json({
      success: true,
      data: { available: !existing },
    });
  } catch (error) {
    console.error('Check username error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
