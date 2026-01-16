import { Coffee } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { DEFAULT_COFFEE_EMOJI } from '@/constants';

interface SupportCardProps {
  supporterName: string;
  coffeeCount: number;
  message: string | null;
  paidAt: Date | string;
}

export function SupportCard({
  supporterName,
  coffeeCount,
  message,
  paidAt,
}: SupportCardProps) {
  const timeAgo = formatDistanceToNow(new Date(paidAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Card className="rounded-xl border shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF8E7] text-2xl border border-[#FFDD00]/30">
            {DEFAULT_COFFEE_EMOJI}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base truncate">{supporterName}</span>
                <span className="text-sm font-semibold text-[#6F4E37] bg-[#FFDD00]/10 px-2 py-0.5 rounded-full">
                  x {coffeeCount}
                </span>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
            </div>
            {message && (
              <div className="relative mt-2 p-3 bg-muted/30 rounded-lg italic text-sm text-foreground/80 break-words">
                "{message}"
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
