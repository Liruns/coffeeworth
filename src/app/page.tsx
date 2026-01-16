import Link from 'next/link';
import { 
  Coffee, 
  Zap, 
  Shield, 
  Bell, 
  ArrowRight, 
  Heart, 
  Share2, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { 
  APP_NAME, 
  DEFAULT_COFFEE_PRICE, 
  PLATFORM_FEE_RATE 
} from '@/constants';

export default function HomePage() {
  const platformFeePercentage = (PLATFORM_FEE_RATE * 100).toFixed(0);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-20 md:py-32">
          {/* Background Decoration */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#FFDD00]/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#6F4E37]/5 blur-3xl" />
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF8E7] px-4 py-1.5 text-sm font-medium text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#FFDD00]">
              <Sparkles className="h-4 w-4" />
              <span>한국 크리에이터를 위한 새로운 후원 문화</span>
            </div>
            
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              {APP_NAME}
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              당신의 콘텐츠에 커피 한 잔의 응원을.<br className="hidden sm:block" />
              복잡한 절차 없이 팬들에게 직접 후원을 받아보세요.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                className="bg-[#FFDD00] text-black hover:bg-[#E5C700] text-lg font-bold h-14 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
                asChild
              >
                <Link href="/login">
                  시작하기 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg h-14 px-8 rounded-full border-2"
                asChild
              >
                <Link href="#features">더 알아보기</Link>
              </Button>
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-8 text-muted-foreground grayscale opacity-70">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-foreground">3,000원</span>
                <span className="text-sm">기본 커피 한 잔</span>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-foreground">{platformFeePercentage}%</span>
                <span className="text-sm">투명한 수수료</span>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-foreground">1분</span>
                <span className="text-sm">간편한 가입</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                크리에이터를 위한 최고의 선택
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                복잡한 설정은 생략하고, 창작 활동에만 집중하세요.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-none shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF8E7] text-[#6F4E37] dark:bg-[#6F4E37]/30 dark:text-[#FFDD00]">
                    <Coffee className="h-6 w-6" />
                  </div>
                  <CardTitle>간편한 후원 페이지</CardTitle>
                  <CardDescription>
                    로그인 한 번이면 나만의 후원 페이지가 완성됩니다. <code>/@아이디</code> 링크만 공유하세요.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF8E7] text-[#6F4E37] dark:bg-[#6F4E37]/30 dark:text-[#FFDD00]">
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle>카카오페이/토스 결제</CardTitle>
                  <CardDescription>
                    한국인이 가장 많이 사용하는 간편 결제를 모두 지원합니다. 클릭 한 번으로 끝나는 후원 경험.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF8E7] text-[#6F4E37] dark:bg-[#6F4E37]/30 dark:text-[#FFDD00]">
                    <Bell className="h-6 w-6" />
                  </div>
                  <CardTitle>실시간 알림</CardTitle>
                  <CardDescription>
                    후원이 발생하면 즉시 이메일과 알림을 보내드립니다. 팬들의 소중한 응원을 놓치지 마세요.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF8E7] text-[#6F4E37] dark:bg-[#6F4E37]/30 dark:text-[#FFDD00]">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle>투명한 수수료</CardTitle>
                  <CardDescription>
                    플랫폼 수수료는 단 {platformFeePercentage}%뿐입니다. 크리에이터의 수익을 최우선으로 생각합니다.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                어떻게 시작하나요?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                단 3단계면 후원을 받을 준비가 끝납니다.
              </p>
            </div>
            
            <div className="relative grid gap-12 md:grid-cols-3">
              {/* Connector line for desktop */}
              <div className="absolute top-24 left-1/4 right-1/4 hidden h-0.5 bg-border md:block" />
              
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDD00] text-black text-2xl font-bold z-10 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">가입하고 페이지 만들기</h3>
                <p className="text-muted-foreground">
                  카카오 계정으로 5초 만에 가입하고<br />나만의 프로필을 설정하세요.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDD00] text-black text-2xl font-bold z-10 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">링크 공유하기</h3>
                <p className="text-muted-foreground">
                  블로그, 유튜브, 깃허브 등<br />콘텐츠가 있는 곳에 후원 링크를 걸어주세요.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDD00] text-black text-2xl font-bold z-10 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">후원 받기</h3>
                <p className="text-muted-foreground">
                  팬들의 소중한 커피 한 잔을 받고<br />활동을 이어나갈 힘을 얻으세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Stats Section */}
        <section className="bg-[#6F4E37] py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-3 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">1,000+</div>
                <div className="text-amber-200/80">활동 중인 크리에이터</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <div className="text-amber-200/80">누적 전달된 커피</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-amber-200/80">사용자 만족도</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="rounded-3xl bg-[#FFF8E7] p-8 md:p-16 text-center dark:bg-zinc-900 border border-[#FFDD00]/20">
              <Heart className="mx-auto h-12 w-12 text-[#6F4E37] mb-6 dark:text-[#FFDD00]" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                당신의 창작 활동에 온기를 더하세요
              </h2>
              <p className="mt-6 text-xl text-muted-foreground">
                지금 바로 시작하고 팬들과 더 가깝게 소통하세요.<br />
                가입은 무료이며, 후원이 발생할 때까지 비용이 들지 않습니다.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-[#FFDD00] text-black hover:bg-[#E5C700] text-lg font-bold h-14 px-10 rounded-full shadow-xl w-full sm:w-auto"
                  asChild
                >
                  <Link href="/login">무료로 시작하기</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="text-lg h-14 px-8 rounded-full w-full sm:w-auto"
                  asChild
                >
                  <Link href="/contact">궁금한 점이 있으신가요?</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
