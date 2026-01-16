import { auth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Users, Wallet, TrendingUp } from 'lucide-react';
import { APP_NAME } from '@/constants';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          안녕하세요, <span className="text-[#6F4E37]">{session?.user?.name || '크리에이터'}</span>님!
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          오늘도 {APP_NAME}에서 따뜻한 응원을 받아보세요.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all border-l-4 border-l-[#FFDD00]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">이번 달 후원</CardTitle>
            <Coffee className="h-5 w-5 text-[#FFDD00]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0원</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">↑ 0%</span> 지난달 대비
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all border-l-4 border-l-[#6F4E37]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">총 서포터</CardTitle>
            <Users className="h-5 w-5 text-[#6F4E37]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0명</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">+0</span> 이번 달 새 서포터
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all border-l-4 border-l-[#FFDD00]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">정산 예정</CardTitle>
            <Wallet className="h-5 w-5 text-[#FFDD00]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0원</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              다음 정산일: 매주 금요일
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all border-l-4 border-l-[#6F4E37]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">누적 받은 커피</CardTitle>
            <TrendingUp className="h-5 w-5 text-[#6F4E37]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0잔</div>
            <p className="text-xs text-muted-foreground mt-1">
              지금까지 받은 따뜻한 마음
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Support */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-xl">체크리스트</CardTitle>
            <CardDescription>
              후원을 받기 위해 다음 단계들을 완료해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-medium">
                <div className="h-6 w-6 rounded-full bg-[#FFF8E7] flex items-center justify-center border border-[#FFDD00]/30 text-xs">1</div>
                프로필 정보 설정하기
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <div className="h-6 w-6 rounded-full bg-[#FFF8E7] flex items-center justify-center border border-[#FFDD00]/30 text-xs">2</div>
                매력적인 사용자 이름 정하기
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <div className="h-6 w-6 rounded-full bg-[#FFF8E7] flex items-center justify-center border border-[#FFDD00]/30 text-xs">3</div>
                정산받을 계좌 정보 등록하기
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <div className="h-6 w-6 rounded-full bg-[#FFF8E7] flex items-center justify-center border border-[#FFDD00]/30 text-xs">4</div>
                소셜 미디어에 내 페이지 공유하기
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-xl">최근 후원</CardTitle>
            <CardDescription>
              실시간으로 들어오는 응원 메시지를 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex min-h-[200px] flex-col items-center justify-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-[#FFF8E7] flex items-center justify-center mb-4 border-2 border-[#FFDD00]/20">
                <Coffee className="h-8 w-8 text-[#FFDD00]" />
              </div>
              <p className="font-bold text-lg">아직 받은 후원이 없습니다</p>
              <p className="text-sm text-muted-foreground mt-1">
                첫 번째 서포터가 곧 나타날 거예요!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
