import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CreatorCard } from '@/components/creator/creator-card';
import { SupportForm } from '@/components/creator/support-form';
import { SupportCard } from '@/components/creator/support-card';
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
    <div className="min-h-screen bg-[#FFF8E7]/30 dark:bg-background">
      <div className="container max-w-2xl py-12 md:py-20">
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
        <div className="mt-12">
          <SupportForm
            creatorUsername={creator.username!}
            creatorName={displayName}
            coffeePrice={creator.coffeePrice}
            themeColor={creator.themeColor}
          />
        </div>

        {/* Recent Supports */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight">최근 후원자들</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          {creator.recentSupports.length > 0 ? (
            <div className="grid gap-4">
              {creator.recentSupports.map((support: { id: string; supporterName: string; coffeeCount: number; message: string | null; paidAt: Date | null }) => (
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
            <div className="text-center py-12 bg-card rounded-xl border border-dashed">
              <p className="text-muted-foreground">아직 후원이 없습니다. 첫 번째 후원자가 되어보세요!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            Powered by{' '}
            <a href="/" className="text-[#6F4E37] hover:text-[#FFDD00] transition-colors font-bold">
              {APP_NAME}
            </a>
            <span>☕</span>
          </p>
        </div>
      </div>
    </div>
  );
}
