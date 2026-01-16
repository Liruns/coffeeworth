import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Coffee } from 'lucide-react';
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
    <div className="relative min-h-screen bg-[#FFF8E7]/40 dark:bg-zinc-950 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[#FFDD00]/10 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[#6F4E37]/5 blur-[100px] -z-10" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-16 sm:px-6 md:py-28 lg:px-8">
        {/* Creator Profile */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700" aria-label="크리에이터 프로필">
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
        </section>

        {/* Support Form */}
        <div className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <SupportForm
            creatorUsername={creator.username!}
            creatorName={displayName}
            coffeePrice={creator.coffeePrice}
            themeColor={creator.themeColor}
          />
        </div>

        {/* Recent Supports */}
        <section className="mt-20 space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500" aria-label="최근 후원 목록">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black tracking-tight text-[#6F4E37] dark:text-[#FFDD00]">최근 따뜻한 응원들</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-[#FFDD00]/40 to-transparent rounded-full" />
          </div>
          
          {creator.recentSupports.length > 0 ? (
            <div className="grid gap-6">
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
            <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 rounded-[2.5rem] border-2 border-dashed border-[#FFDD00]/30 backdrop-blur-sm">
              <Coffee className="h-12 w-12 text-[#FFDD00]/50 mx-auto mb-4" />
              <p className="text-lg font-bold text-muted-foreground italic">아직 도착한 응원이 없어요.<br />첫 번째 따뜻한 마음을 전해보세요! ☕</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <div className="mt-32 text-center">
          <div className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-[#FFDD00]/20 shadow-sm backdrop-blur-sm">
            <span className="text-sm font-bold text-muted-foreground tracking-tight">Powered by</span>
            <Link href="/" className="flex items-center gap-1.5 group">
              <Coffee className="h-5 w-5 text-[#FFDD00] fill-[#FFDD00] group-hover:rotate-12 transition-transform" />
              <span className="text-base font-black text-[#6F4E37] dark:text-[#FFDD00]">{APP_NAME}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

