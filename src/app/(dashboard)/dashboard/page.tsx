import { auth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Users, Wallet, TrendingUp } from 'lucide-react';
import { APP_NAME } from '@/constants';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-10 pb-10">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#6F4E37] p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            안녕하세요,<br />
            <span className="text-[#FFDD00]">{session?.user?.name || '크리에이터'}</span>님! ☕
          </h1>
          <p className="text-xl text-amber-100/70 mt-4 font-medium max-w-xl">
            오늘도 {APP_NAME}에는 당신을 향한 따뜻한 응원이 기다리고 있습니다.
          </p>
        </div>
        <Coffee className="absolute bottom-[-20px] right-[-20px] h-64 w-64 text-white/5 rotate-12" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: '이번 달 후원', value: '0원', icon: Coffee, color: '#FFDD00', trend: '↑ 0% 지난달 대비' },
          { title: '총 서포터', value: '0명', icon: Users, color: '#6F4E37', trend: '+0 이번 달 새 서포터' },
          { title: '정산 예정', value: '0원', icon: Wallet, color: '#FFDD00', trend: '다음 정산일: 매주 금요일' },
          { title: '누적 받은 커피', value: '0잔', icon: TrendingUp, color: '#6F4E37', trend: '지금까지 받은 따뜻한 마음' },
        ].map((stat, i) => (
          <Card key={i} className="group rounded-3xl border-2 border-white dark:border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80 overflow-hidden">
            <div className="h-1.5 w-full" style={{ backgroundColor: stat.color }} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 transition-transform group-hover:scale-110" style={{ color: stat.color }} />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-black tracking-tight">{stat.value}</div>
              <p className="text-xs font-bold text-muted-foreground mt-2 bg-muted/50 inline-block px-2 py-1 rounded-lg">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Support */}
      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-2 rounded-[2rem] border-2 border-white dark:border-zinc-800 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
          <CardHeader className="bg-muted/30 border-b p-8">
            <CardTitle className="text-2xl font-black">성장 체크리스트</CardTitle>
            <CardDescription className="text-base font-medium">
              더 많은 응원을 받기 위한 첫걸음입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <ul className="space-y-6">
              {[
                '프로필 정보 설정하기',
                '매력적인 사용자 이름 정하기',
                '정산받을 계좌 정보 등록하기',
                '소셜 미디어에 내 페이지 공유하기',
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-[#FFF8E7] flex items-center justify-center border-2 border-[#FFDD00]/30 text-sm font-black text-[#6F4E37] group-hover:bg-[#FFDD00] transition-colors">
                    {i + 1}
                  </div>
                  <span className="text-base font-bold text-foreground/80 group-hover:text-foreground transition-colors">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 rounded-[2rem] border-2 border-white dark:border-zinc-800 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
          <CardHeader className="bg-muted/30 border-b p-8">
            <CardTitle className="text-2xl font-black">최근 응원 메시지</CardTitle>
            <CardDescription className="text-base font-medium">
              실시간으로 도착하는 팬들의 마음을 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center p-12">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#FFDD00] blur-2xl opacity-20 animate-pulse" />
                <div className="relative h-24 w-24 rounded-[2rem] bg-[#FFF8E7] flex items-center justify-center border-4 border-[#FFDD00]/20 rotate-6">
                  <Coffee className="h-12 w-12 text-[#FFDD00] fill-[#FFDD00]/10" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#6F4E37] dark:text-foreground">아직 도착한 응원이 없습니다</h3>
              <p className="text-lg font-medium text-muted-foreground mt-2 max-w-xs">
                준비된 체크리스트를 완료하면 첫 번째 팬이 곧 나타날 거예요!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
