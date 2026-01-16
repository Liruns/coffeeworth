import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const maxWidthMap = {
  sm: 'max-w-md',    // 448px (로그인, 모달)
  md: 'max-w-lg',    // 512px (후원 폼)
  lg: 'max-w-2xl',   // 672px (크리에이터 페이지)
  xl: 'max-w-4xl',   // 896px (대시보드 콘텐츠)
  '2xl': 'max-w-5xl',
  '4xl': 'max-w-7xl', // 1280px (전체 레이아웃)
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const paddingMap = {
  none: 'p-0',
  sm: 'px-4 py-8 sm:px-6 sm:py-12',
  md: 'px-4 py-16 sm:px-6 lg:px-8 lg:py-24',
  lg: 'px-4 py-24 sm:px-6 lg:px-8 lg:py-32',
};

export function PageContainer({
  children,
  maxWidth = '7xl',
  className,
  padding = 'md',
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        maxWidthMap[maxWidth],
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
