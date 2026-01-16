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
        <section className="relative overflow-hidden bg-background py-24 md:py-40">
          {/* Background Decoration - More layered and premium */}
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#FFDD00]/20 blur-[100px] animate-pulse" />
          <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-[#6F4E37]/10 blur-[80px]" />
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF8E7] px-5 py-2 text-sm font-semibold text-[#6F4E37] dark:bg-[#6F4E37]/40 dark:text-[#FFDD00] shadow-sm border border-[#FFDD00]/20">
              <Sparkles className="h-4 w-4 text-[#FFDD00]" />
              <span>한국 크리에이터를 위한 가장 따뜻한 후원</span>
            </div>
            
            <h1 className="mt-10 text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl leading-[1.1]">
              {APP_NAME}
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              좋아하는 크리에이터에게<br />
              <span className="text-[#6F4E37] dark:text-[#FFDD00] font-bold underline underline-offset-8 decoration-[#FFDD00]/40">커피 한 잔의 응원</span>을 직접 전달하세요.
            </p>
            
            <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <Button 
                size="lg" 
                className="bg-[#FFDD00] text-black hover:bg-[#E5C700] text-xl font-bold h-16 px-10 rounded-2xl shadow-[0_8px_30px_rgb(255,221,0,0.3)] transition-all hover:scale-105 active:scale-95"
                asChild
              >
                <Link href="/login">
                  지금 바로 시작하기 <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg h-16 px-10 rounded-2xl border-2 hover:bg-muted/50 transition-all font-semibold"
                asChild
              >
                <Link href="#features">기능 살펴보기</Link>
              </Button>
            </div>
            
            <div className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-muted-foreground">
              <div className="flex flex-col items-center group">
                <span className="text-4xl font-black text-foreground group-hover:text-[#6F4E37] transition-colors">3,000원</span>
                <span className="text-sm font-bold tracking-widest uppercase mt-2">기본 커피 가격</span>
              </div>
              <div className="hidden md:block h-12 w-px bg-border/50" />
              <div className="flex flex-col items-center group">
                <span className="text-4xl font-black text-foreground group-hover:text-[#6F4E37] transition-colors">{platformFeePercentage}%</span>
                <span className="text-sm font-bold tracking-widest uppercase mt-2">업계 최저 수수료</span>
              </div>
              <div className="hidden md:block h-12 w-px bg-border/50" />
              <div className="flex flex-col items-center group">
                <span className="text-4xl font-black text-foreground group-hover:text-[#6F4E37] transition-colors">5초</span>
                <span className="text-sm font-bold tracking-widest uppercase mt-2">초간편 가입</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-[#FFF8E7]/30 py-32 border-y border-[#FFDD00]/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-[#6F4E37]">
                크리에이터를 위한 따뜻한 공간
              </h2>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                팬들의 응원이 실질적인 수익으로 이어지도록<br />
                가장 심플하고 강력한 도구를 제공합니다.
              </p>
            </div>
            
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              <Card className="group border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-white transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF8E7] text-[#6F4E37] group-hover:bg-[#FFDD00] group-hover:text-black transition-colors duration-300">
                    <Coffee className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold">심플한 후원 링크</CardTitle>
                  <CardDescription className="text-base font-medium leading-relaxed pt-2">
                    나만의 고유 주소를 공유하세요. 팬들은 복잡한 가입 없이 바로 후원할 수 있습니다.
                  </CardDescription>
                </CardHeader>
              </Card>


              <Card className="group border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-white transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF8E7] text-[#6F4E37] group-hover:bg-[#FFDD00] group-hover:text-black transition-colors duration-300">
                    <Zap className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold">간편한 결제 시스템</CardTitle>
                  <CardDescription className="text-base font-medium leading-relaxed pt-2">
                    카카오페이, 토스페이 등 한국인이 선호하는 모든 결제 수단을 클릭 한 번으로 제공합니다.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-white transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF8E7] text-[#6F4E37] group-hover:bg-[#FFDD00] group-hover:text-black transition-colors duration-300">
                    <Bell className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold">실시간 소통 알림</CardTitle>
                  <CardDescription className="text-base font-medium leading-relaxed pt-2">
                    후원 메시지가 도착하면 즉시 알림을 드립니다. 팬들의 소중한 목소리에 바로 응답하세요.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-white transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF8E7] text-[#6F4E37] group-hover:bg-[#FFDD00] group-hover:text-black transition-colors duration-300">
                    <Shield className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold">투명한 정산 관리</CardTitle>
                  <CardDescription className="text-base font-medium leading-relaxed pt-2">
                    수수료는 단 {platformFeePercentage}%뿐입니다. 매주 금요일, 정직하게 정산된 수익금을 확인하세요.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 h-64 w-64 bg-[#FFDD00]/5 blur-[80px]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                어떻게 시작하나요?
              </h2>
              <p className="mt-6 text-xl text-muted-foreground font-medium">
                복잡한 과정 없이 3분 만에 모든 준비를 마칠 수 있습니다.
              </p>
            </div>
            
            <div className="relative grid gap-20 md:grid-cols-3">
              {/* Desktop Connection Path */}
              <div className="absolute top-16 left-1/4 right-1/4 hidden h-1 border-t-4 border-dashed border-[#FFDD00]/20 md:block" />
              
              <div className="relative flex flex-col items-center text-center group">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-[#FFDD00] text-black text-3xl font-black z-10 shadow-[0_10px_30px_rgba(255,221,0,0.4)] group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4">페이지 개설</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium px-4">
                  카카오 계정으로 간편하게 가입하고<br />나만의 프로필을 개성 있게 꾸미세요.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center group">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-[#FFDD00] text-black text-3xl font-black z-10 shadow-[0_10px_30px_rgba(255,221,0,0.4)] group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4">링크 공유</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium px-4">
                  블로그, 깃허브, SNS 프로필 등<br />나의 링크를 어디든 자유롭게 거세요.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center group">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-[#FFDD00] text-black text-3xl font-black z-10 shadow-[0_10px_30px_rgba(255,221,0,0.4)] group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4">응원 받기</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium px-4">
                  팬들이 보내주는 따뜻한 응원과<br />커피 한 잔으로 창작의 힘을 얻으세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Stats Section */}
        <section className="bg-[#6F4E37] py-28 text-white relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-[80px]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:gap-16 sm:grid-cols-2 md:grid-cols-3 text-center">
              <div>
                <div className="text-6xl font-black mb-4 text-[#FFDD00]">1,000+</div>
                <div className="text-xl font-bold text-amber-100/70 tracking-widest uppercase">활동 중인 크리에이터</div>
              </div>
              <div>
                <div className="text-6xl font-black mb-4 text-[#FFDD00]">50,000+</div>
                <div className="text-xl font-bold text-amber-100/70 tracking-widest uppercase">누적 전달된 응원</div>
              </div>
              <div>
                <div className="text-6xl font-black mb-4 text-[#FFDD00]">99%</div>
                <div className="text-xl font-bold text-amber-100/70 tracking-widest uppercase">사용자 만족도</div>
              </div>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-32">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[3rem] bg-[#FFF8E7] p-10 md:p-24 text-center dark:bg-zinc-900 border-2 border-[#FFDD00]/30 shadow-2xl overflow-hidden">
              <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#FFDD00]/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#6F4E37]/10 blur-3xl" />
              
              <Heart className="mx-auto h-16 w-16 text-[#6F4E37] mb-8 dark:text-[#FFDD00] animate-pulse" />
              <h2 className="text-4xl font-black tracking-tight sm:text-6xl text-foreground leading-[1.1]">
                당신의 창작 활동에<br />따뜻함을 더하세요
              </h2>
              <p className="mt-8 text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                지금 바로 {APP_NAME}와 함께 시작하세요.<br />
                팬들과 더 가깝게 소통하며 소중한 응원을 받을 수 있습니다.
              </p>
              <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button 
                  size="lg" 
                  className="bg-[#FFDD00] text-black hover:bg-[#E5C700] text-xl font-bold h-16 px-12 rounded-[1.5rem] shadow-[0_10px_30px_rgba(255,221,0,0.3)] w-full sm:w-auto transition-transform hover:scale-105 active:scale-95"
                  asChild
                >
                  <Link href="/login">지금 시작하기 (무료)</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="text-xl h-16 px-10 rounded-[1.5rem] w-full sm:w-auto font-bold text-[#6F4E37] dark:text-muted-foreground hover:bg-[#FFDD00]/10 transition-colors"
                  asChild
                >
                  <Link href="/contact">궁금한 점 문의하기</Link>
                </Button>
              </div>
              <p className="mt-8 text-sm font-bold text-[#6F4E37]/60 dark:text-muted-foreground/60 tracking-wider">
                가입은 무료이며, 후원이 발생할 때까지 수수료가 청구되지 않습니다.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
