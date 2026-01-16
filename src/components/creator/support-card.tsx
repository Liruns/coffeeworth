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
    <Card className="group overflow-hidden rounded-3xl border-2 border-white bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:border-zinc-800" role="article">
      <CardContent className="p-5 sm:p-6 md:p-8">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-[#FFDD00] blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF8E7] text-3xl border-2 border-[#FFDD00]/30 shadow-sm group-hover:rotate-6 transition-transform">
              {DEFAULT_COFFEE_EMOJI}
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFDD00] text-black text-xs font-black shadow-md border-2 border-white dark:border-zinc-800">
              x{coffeeCount}
            </div>
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="block font-black text-xl text-[#6F4E37] dark:text-[#FFDD00] truncate">
                  {supporterName}
                </span>
                <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {timeAgo}
                </span>
              </div>
            </div>
            
            {message && (
              <div className="relative mt-4 pt-4 border-t border-muted-foreground/5">
                <div className="absolute -left-1 -top-1 text-4xl text-[#FFDD00]/10 font-serif">&ldquo;</div>
                <p className="relative text-lg font-medium text-foreground/80 leading-relaxed break-words pl-2 italic">
                  {message}
                </p>
                <div className="absolute -right-1 bottom-0 text-4xl text-[#FFDD00]/10 font-serif">&rdquo;</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

