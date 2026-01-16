import { auth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Users, Wallet, TrendingUp } from 'lucide-react';
import { APP_NAME } from '@/constants';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-[#6F4E37] p-8 md:p-12 text-white shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          안녕하세요,<br />
          <span className="text-[#FFDD00]">{session?.user?.name || '크리에이터'}</span>님! ☕
        </h1>
        <p className="text-amber-100/70 mt-4 text-lg max-w-xl">
          오늘도 {APP_NAME}에는 당신을 향한 따뜻한 응원이 기다리고 있습니다.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: '이번 달 후원', value: '0원', icon: Coffee, color: 'text-[#FFDD00]', trend: '0% vs 지난달' },
          { title: '총 서포터', value: '0명', icon: Users, color: 'text-[#6F4E37] dark:text-[#FFDD00]', trend: '+0 이번 달' },
          { title: '정산 예정', value: '0원', icon: Wallet, color: 'text-[#FFDD00]', trend: '매주 금요일 정산' },
          { title: '누적 커피', value: '0잔', icon: TrendingUp, color: 'text-[#6F4E37] dark:text-[#FFDD00]', trend: '전체 후원 수량' },
        ].map((stat, i) => (
          <Card key={i} className="border shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Support */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">성장 체크리스트</CardTitle>
            <CardDescription>
              더 많은 응원을 받기 위한 시작
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                '프로필 정보 설정하기',
                '매력적인 사용자 이름 정하기',
                '정산받을 계좌 정보 등록하기',
                '소셜 미디어에 내 페이지 공유하기',
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">최근 응원 메시지</CardTitle>
            <CardDescription>
              실시간으로 도착하는 팬들의 마음
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[240px] flex flex-col items-center justify-center text-center p-8">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Coffee className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold text-muted-foreground">아직 도착한 응원이 없습니다</h3>
            <p className="text-sm text-muted-foreground/60 mt-1">
              링크를 공유하면 팬들의 메시지가 여기 표시됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
