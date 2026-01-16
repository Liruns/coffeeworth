// src/lib/auth.ts

import NextAuth from 'next-auth';
import Kakao from 'next-auth/providers/kakao';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import type { Adapter } from 'next-auth/adapters';
import type { Provider } from 'next-auth/providers';

// 프로바이더 목록 구성
const providers: Provider[] = [];

// 카카오 OAuth (프로덕션)
if (process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET) {
  providers.push(
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    })
  );
}

// 개발용 로그인 (ENABLE_DEV_LOGIN=true 일 때만)
if (process.env.ENABLE_DEV_LOGIN === 'true') {
  providers.push(
    Credentials({
      id: 'dev-login',
      name: '개발용 로그인',
      credentials: {
        email: { label: '이메일', type: 'email', placeholder: 'test@example.com' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = credentials.email as string;

        // 기존 사용자 찾기 또는 생성
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: email.split('@')[0],
              username: email.split('@')[0].replace(/[^a-z0-9_]/g, '_').slice(0, 20),
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
        };
      },
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers,
  session: {
    strategy: process.env.ENABLE_DEV_LOGIN === 'true' ? 'jwt' : 'database',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string | null }).username;
      }
      return token;
    },
    session: async ({ session, token, user }) => {
      if (session.user) {
        // JWT 세션 (개발 모드)
        if (token) {
          session.user.id = token.id as string;
          session.user.username = token.username as string | null;
        }
        // DB 세션 (프로덕션)
        if (user) {
          session.user.id = user.id;
          session.user.username = (user as { username?: string | null }).username ?? null;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
