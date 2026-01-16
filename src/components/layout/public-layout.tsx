import { Header } from "./header";
import { Footer } from "./footer";
import { PageContainer } from "./page-container";
import { cn } from "@/lib/utils";

interface PublicLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
  centered?: boolean;
  className?: string;
  containerClassName?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function PublicLayout({
  children,
  showHeader = true,
  showFooter = true,
  maxWidth = '7xl',
  centered = false,
  className,
  containerClassName,
  padding,
}: PublicLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col", className)}>
      {showHeader && <Header />}
      <main className={cn("flex-1", centered && "flex items-center justify-center")}>
        <PageContainer 
          maxWidth={maxWidth} 
          className={containerClassName}
          padding={padding || (centered ? 'none' : 'md')}
        >
          {children}
        </PageContainer>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
