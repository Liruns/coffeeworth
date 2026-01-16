// prisma/seed.ts
// 테스트 데이터 시드

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 생성 시작...');

  // 테스트 크리에이터 생성
  const creator = await prisma.user.upsert({
    where: { email: 'creator@test.com' },
    update: {},
    create: {
      email: 'creator@test.com',
      name: '테스트 크리에이터',
      username: 'testcreator',
      bio: '안녕하세요! 저는 테스트 크리에이터입니다. 커피 한 잔의 응원이 큰 힘이 됩니다!',
      coffeePrice: 3000,
      themeColor: '#FFDD00',
      socialLinks: {
        github: 'https://github.com/testcreator',
        blog: 'https://blog.test.com',
      },
      isPublic: true,
      emailNotify: true,
    },
  });
  console.log('✅ 크리에이터 생성:', creator.email);

  // 테스트 후원자 생성
  const supporter = await prisma.user.upsert({
    where: { email: 'supporter@test.com' },
    update: {},
    create: {
      email: 'supporter@test.com',
      name: '테스트 후원자',
      username: 'testsupporter',
      isPublic: true,
    },
  });
  console.log('✅ 후원자 생성:', supporter.email);

  // 테스트 후원 데이터 생성
  const supports = [
    {
      creatorId: creator.id,
      supporterId: supporter.id,
      supporterName: '커피덕후',
      coffeeCount: 3,
      unitPrice: 3000,
      amount: 9000,
      message: '항상 좋은 글 감사합니다! 응원해요!',
      isAnonymous: false,
      orderId: `ORD_TEST_${Date.now()}_1`,
      status: 'COMPLETED' as const,
      paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2일 전
      platformFee: 450,
      pgFee: 252,
      netAmount: 8298,
    },
    {
      creatorId: creator.id,
      supporterName: '익명',
      coffeeCount: 1,
      unitPrice: 3000,
      amount: 3000,
      message: null,
      isAnonymous: true,
      orderId: `ORD_TEST_${Date.now()}_2`,
      status: 'COMPLETED' as const,
      paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
      platformFee: 150,
      pgFee: 84,
      netAmount: 2766,
    },
    {
      creatorId: creator.id,
      supporterName: '개발자김씨',
      coffeeCount: 5,
      unitPrice: 3000,
      amount: 15000,
      message: '덕분에 많이 배웠습니다. 커피 한잔 드세요!',
      isAnonymous: false,
      orderId: `ORD_TEST_${Date.now()}_3`,
      status: 'COMPLETED' as const,
      paidAt: new Date(), // 오늘
      platformFee: 750,
      pgFee: 420,
      netAmount: 13830,
    },
  ];

  for (const support of supports) {
    await prisma.support.upsert({
      where: { orderId: support.orderId },
      update: {},
      create: support,
    });
  }
  console.log('✅ 후원 데이터 생성:', supports.length, '건');

  console.log('');
  console.log('🎉 시드 데이터 생성 완료!');
  console.log('');
  console.log('테스트 계정:');
  console.log('  - 크리에이터: creator@test.com (페이지: /testcreator)');
  console.log('  - 후원자: supporter@test.com');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
