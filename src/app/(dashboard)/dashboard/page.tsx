import { auth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Users, Wallet, TrendingUp } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          안녕하세요, {session?.user?.name || '크리에이터'}님!
        </h1>
        <p className="text-muted-foreground">
          오늘도 커피값좀에서 좋은 하루 보내세요.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달 후원</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0원</div>
            <p className="text-xs text-muted-foreground">
              +0% 지난달 대비
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 서포터</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0명</div>
            <p className="text-xs text-muted-foreground">
              +0 이번 달
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">정산 예정</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0원</div>
            <p className="text-xs text-muted-foreground">
              다음 정산일: -
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 커피</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0잔</div>
            <p className="text-xs text-muted-foreground">
              누적 받은 커피
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>시작하기</CardTitle>
            <CardDescription>
              몇 가지 설정만 완료하면 후원을 받을 수 있어요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-muted" />
                프로필 설정 완료하기
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-muted" />
                사용자 이름 설정하기
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-muted" />
                정산 계좌 등록하기
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>최근 후원</CardTitle>
            <CardDescription>
              아직 받은 후원이 없습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[100px] items-center justify-center text-sm text-muted-foreground">
              첫 번째 서포터를 기다리고 있어요!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
