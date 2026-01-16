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
    <Card className="border shadow-sm rounded-xl overflow-hidden bg-card">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl border">
            {DEFAULT_COFFEE_EMOJI}
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFDD00] text-black text-[10px] font-bold border-2 border-background">
            {coffeeCount}
          </div>
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-foreground truncate">{supporterName}</p>
            <p className="text-[10px] text-muted-foreground whitespace-nowrap">{timeAgo}</p>
          </div>
          
          {message && (
            <p className="text-sm text-muted-foreground leading-relaxed break-words">
              {message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
