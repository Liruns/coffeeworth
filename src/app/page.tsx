import Link from 'next/link';
import { 
  Coffee, 
  Zap, 
  Shield, 
  Bell, 
  ArrowRight, 
  Heart, 
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
import { PublicLayout } from '@/components/layout/public-layout';
import { Section } from '@/components/layout/section';
import { PageContainer } from '@/components/layout/page-container';
import { 
  APP_NAME, 
  PLATFORM_FEE_RATE 
} from '@/constants';

export default function HomePage() {
  const platformFeePercentage = (PLATFORM_FEE_RATE * 100).toFixed(0);

  return (
    <PublicLayout padding="none">
      {/* Hero Section */}
      <Section className="py-20 md:py-32">
        <PageContainer maxWidth="4xl" padding="none" className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8">
            <Sparkles className="h-4 w-4 text-[#FFDD00]" />
            <span>한국 크리에이터를 위한 가장 따뜻한 후원</span>
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl mb-6">
            {APP_NAME}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            좋아하는 크리에이터에게<br />
            <span className="text-foreground font-semibold">커피 한 잔의 응원</span>을 직접 전달하세요.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              className="bg-[#FFDD00] text-black hover:bg-[#E5C700] text-lg font-bold h-14 px-8 rounded-xl shadow-sm"
              asChild
            >
              <Link href="/login">
                지금 바로 시작하기 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg h-14 px-8 rounded-xl font-semibold"
              asChild
            >
              <Link href="#features">기능 살펴보기</Link>
            </Button>
          </div>
          
          <div className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-foreground">3,000원</span>
              <span className="text-sm font-medium text-muted-foreground mt-1">기본 커피 가격</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-foreground">{platformFeePercentage}%</span>
              <span className="text-sm font-medium text-muted-foreground mt-1">낮은 수수료</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-foreground">5초</span>
              <span className="text-sm font-medium text-muted-foreground mt-1">초간편 가입</span>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* Features Section */}
      <Section id="features" background="muted" className="py-24">
        <PageContainer maxWidth="7xl" padding="none">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              크리에이터를 위한 따뜻한 공간
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              팬들의 응원이 실질적인 수익으로 이어지도록<br />
              가장 심플하고 강력한 도구를 제공합니다.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "심플한 후원 링크",
                description: "나만의 고유 주소를 공유하세요. 팬들은 복잡한 가입 없이 바로 후원할 수 있습니다.",
                icon: Coffee
              },
              {
                title: "간편한 결제 시스템",
                description: "카카오페이, 토스페이 등 한국인이 선호하는 모든 결제 수단을 제공합니다.",
                icon: Zap
              },
              {
                title: "실시간 소통 알림",
                description: "후원 메시지가 도착하면 즉시 알림을 드립니다. 팬들의 소중한 목소리에 응답하세요.",
                icon: Bell
              },
              {
                title: "투명한 정산 관리",
                description: `수수료는 단 ${platformFeePercentage}%뿐입니다. 매주 금요일, 정직하게 정산된 수익금을 확인하세요.`,
                icon: Shield
              }
            ].map((feature, i) => (
              <Card key={i} className="border shadow-sm rounded-xl">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#FFDD00]/10 text-[#6F4E37]">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </Section>

      {/* How It Works Section */}
      <Section className="py-24">
        <PageContainer maxWidth="7xl" padding="none">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              어떻게 시작하나요?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              복잡한 과정 없이 3분 만에 모든 준비를 마칠 수 있습니다.
            </p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { step: 1, title: "페이지 개설", desc: "카카오 계정으로 간편하게 가입하고 나만의 프로필을 꾸미세요." },
              { step: 2, title: "링크 공유", desc: "블로그, 깃허브, SNS 프로필 등 나의 링크를 어디든 자유롭게 거세요." },
              { step: 3, title: "응원 받기", desc: "팬들이 보내주는 따뜻한 응원과 커피 한 잔으로 창작의 힘을 얻으세요." }
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDD00] text-black text-2xl font-bold shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </Section>

      {/* CTA Section */}
      <Section className="py-24">
        <PageContainer maxWidth="4xl" padding="none">
          <Card className="rounded-2xl bg-muted/50 border shadow-sm p-8 md:p-16 text-center">
            <Heart className="mx-auto h-12 w-12 text-[#EF4444] mb-6" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
              당신의 창작 활동에 따뜻함을 더하세요
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              지금 바로 {APP_NAME}와 함께 시작하세요.<br />
              팬들과 더 가깝게 소통하며 소중한 응원을 받을 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-[#FFDD00] text-black hover:bg-[#E5C700] text-lg font-bold h-14 px-10 rounded-xl shadow-sm w-full sm:w-auto"
                asChild
              >
                <Link href="/login">지금 시작하기 (무료)</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg h-14 px-8 rounded-xl font-semibold w-full sm:w-auto"
                asChild
              >
                <Link href="/contact">궁금한 점 문의하기</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              가입은 무료이며, 후원이 발생할 때까지 수수료가 청구되지 않습니다.
            </p>
          </Card>
        </PageContainer>
      </Section>
    </PublicLayout>
  );
}
