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
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-lg">
            {DEFAULT_COFFEE_EMOJI}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{supporterName}</span>
              <span className="text-sm text-muted-foreground">
                x {coffeeCount}
              </span>
            </div>
            {message && (
              <p className="mt-1 text-sm text-muted-foreground break-words">
                {message}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
