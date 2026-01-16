'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = '오류가 발생했습니다',
  description = '잠시 후 다시 시도해주세요.',
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-destructive/50 bg-destructive/5 p-8 text-center',
        className
      )}
    >
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-destructive">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {retry && (
        <Button variant="outline" onClick={retry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}
