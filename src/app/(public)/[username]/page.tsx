import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Coffee } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { CreatorCard } from '@/components/creator/creator-card';
import { SupportForm } from '@/components/creator/support-form';
import { SupportCard } from '@/components/creator/support-card';
import { PublicLayout } from '@/components/layout/public-layout';
import { Section } from '@/components/layout/section';
import { PageContainer } from '@/components/layout/page-container';
import { APP_NAME, APP_URL } from '@/constants';

interface PageProps {
  params: Promise<{ username: string }>;
}

async function getCreator(username: string) {
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
    },
  });

  if (!creator || !creator.isPublic) {
    return null;
  }

  // Stats
  const [supporterCount, coffeeStats, recentSupports] = await Promise.all([
    prisma.support.count({
      where: { creatorId: creator.id, status: 'COMPLETED' },
    }),
    prisma.support.aggregate({
      where: { creatorId: creator.id, status: 'COMPLETED' },
      _sum: { coffeeCount: true },
    }),
    prisma.support.findMany({
      where: { creatorId: creator.id, status: 'COMPLETED' },
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
    }),
  ]);

  return {
    ...creator,
    totalSupporters: supporterCount,
    totalCoffees: coffeeStats._sum.coffeeCount || 0,
    recentSupports: recentSupports.map((s: typeof recentSupports[number]) => ({
      id: s.id,
      supporterName: s.isAnonymous ? '익명' : (s.supporterName || '익명'),
      coffeeCount: s.coffeeCount,
      message: s.isAnonymous ? null : s.message,
      paidAt: s.paidAt,
    })),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const creator = await getCreator(username);

  if (!creator) {
    return { title: '페이지를 찾을 수 없습니다' };
  }

  const displayName = creator.name || creator.username;

  return {
    title: `${displayName}님에게 커피 사주기`,
    description: creator.bio || `${displayName}님을 응원해주세요!`,
    openGraph: {
      title: `${displayName}님에게 커피 사주기 | ${APP_NAME}`,
      description: creator.bio || `${displayName}님을 응원해주세요!`,
      url: `${APP_URL}/@${creator.username}`,
      type: 'profile',
    },
  };
}

export default async function CreatorPage({ params }: PageProps) {
  const { username } = await params;
  const creator = await getCreator(username);

  if (!creator) {
    notFound();
  }

  const displayName = creator.name || creator.username || 'Creator';

  return (
    <PublicLayout padding="none" maxWidth="lg">
      <Section className="py-12 md:py-20">
        <PageContainer maxWidth="lg" padding="none" className="space-y-12">
          {/* Creator Profile */}
          <CreatorCard
            name={creator.name}
            username={creator.username!}
            image={creator.image}
            bio={creator.bio}
            themeColor={creator.themeColor}
            totalSupporters={creator.totalSupporters}
            totalCoffees={creator.totalCoffees}
            socialLinks={creator.socialLinks as Record<string, string> | null}
          />

          {/* Support Form */}
          <SupportForm
            creatorUsername={creator.username!}
            creatorName={displayName}
            coffeePrice={creator.coffeePrice}
            themeColor={creator.themeColor}
          />

          {/* Recent Supports */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold">최근 따뜻한 응원들</h2>
            
            {creator.recentSupports.length > 0 ? (
              <div className="grid gap-4">
                {creator.recentSupports.map((support: any) => (
                  <SupportCard
                    key={support.id}
                    supporterName={support.supporterName}
                    coffeeCount={support.coffeeCount}
                    message={support.message}
                    paidAt={support.paidAt!}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                <Coffee className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">아직 도착한 응원이 없어요.<br />첫 번째 따뜻한 마음을 전해보세요!</p>
              </div>
            )}
          </section>

          {/* Footer Branding */}
          <div className="pt-12 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <span>Powered by</span>
              <span className="font-bold text-foreground flex items-center gap-1">
                <Coffee className="h-4 w-4 text-[#FFDD00]" />
                {APP_NAME}
              </span>
            </Link>
          </div>
        </PageContainer>
      </Section>
    </PublicLayout>
  );
}

