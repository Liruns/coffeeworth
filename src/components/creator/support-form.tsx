'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { COFFEE_PRESETS, MAX_MESSAGE_LENGTH, DEFAULT_COFFEE_EMOJI } from '@/constants';

interface SupportFormProps {
  creatorUsername: string;
  creatorName: string;
  coffeePrice: number;
  themeColor: string;
}

const supportSchema = z.object({
  coffeeCount: z.number().int().min(1).max(100),
  supporterName: z.string().max(50).optional(),
  supporterEmail: z.string().email('올바른 이메일을 입력해주세요').optional().or(z.literal('')),
  message: z.string().max(MAX_MESSAGE_LENGTH).optional(),
  isAnonymous: z.boolean(),
});

type SupportFormData = z.infer<typeof supportSchema>;

export function SupportForm({
  creatorUsername,
  creatorName,
  coffeePrice,
  themeColor,
}: SupportFormProps) {
  const [coffeeCount, setCoffeeCount] = useState(1);
  const [customCount, setCustomCount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      coffeeCount: 1,
      supporterName: '',
      supporterEmail: '',
      message: '',
      isAnonymous: false,
    },
  });

  const handleCoffeeSelect = (count: number) => {
    setCoffeeCount(count);
    setCustomCount('');
    form.setValue('coffeeCount', count);
  };

  const handleCustomCount = (value: string) => {
    setCustomCount(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 100) {
      setCoffeeCount(num);
      form.setValue('coffeeCount', num);
    }
  };

  const totalAmount = coffeePrice * coffeeCount;

  const onSubmit = async (data: SupportFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/supports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          creatorUsername,
          coffeeCount,
        }),
      });

      const result = await res.json();

      if (result.success) {
        // TODO: 토스페이먼츠 결제 호출
        toast.success('후원 준비가 완료되었습니다. 결제를 진행해주세요.');
        // 실제로는 여기서 결제 SDK 호출
      } else {
        toast.error(result.error?.message || '후원 생성에 실패했습니다');
      }
    } catch {
      toast.error('오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-2 border-white dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden bg-white/80 backdrop-blur-xl dark:bg-zinc-900/80">
      <CardHeader className="bg-[#FFDD00]/10 pb-8 pt-10 border-b border-[#FFDD00]/20">
        <CardTitle className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[#FFDD00] shadow-[0_8px_20px_rgba(255,221,0,0.4)] transition-transform hover:scale-110">
            <span className="text-3xl">{DEFAULT_COFFEE_EMOJI}</span>
          </div>
          <span className="text-2xl font-black text-[#6F4E37] dark:text-[#FFDD00]">{creatorName}님에게 따뜻한 응원을</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 md:p-10">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Coffee Count Selection */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-black text-[#6F4E37] dark:text-muted-foreground uppercase tracking-tight">커피 수량 선택</Label>
              <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">최대 100잔</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {COFFEE_PRESETS.map((count) => (
                <Button
                  key={count}
                  type="button"
                  variant={coffeeCount === count && !customCount ? 'default' : 'outline'}
                  className={cn(
                    'h-16 text-xl font-black rounded-2xl transition-all duration-300 border-2',
                    coffeeCount === count && !customCount 
                      ? 'bg-[#FFDD00] text-black border-[#FFDD00] shadow-[0_10px_20px_rgba(255,221,0,0.3)] scale-105' 
                      : 'hover:border-[#FFDD00] hover:bg-[#FFF8E7] dark:hover:bg-zinc-800'
                  )}
                  onClick={() => handleCoffeeSelect(count)}
                >
                  <span className="mr-2">{DEFAULT_COFFEE_EMOJI}</span> {count}
                </Button>
              ))}
              <div className="col-span-2 sm:col-span-1">
                <div className="relative group">
                  <Input
                    type="number"
                    placeholder="직접"
                    min={1}
                    max={100}
                    value={customCount}
                    onChange={(e) => handleCustomCount(e.target.value)}
                    className={cn(
                      'h-16 text-center text-xl font-black rounded-2xl border-2 transition-all',
                      customCount 
                        ? 'border-[#FFDD00] bg-[#FFDD00]/10 ring-2 ring-[#FFDD00]' 
                        : 'group-hover:border-[#FFDD00]'
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#FFF8E7] to-[#FFF1C1] dark:from-zinc-800 dark:to-zinc-900 p-8 text-center border-2 border-[#FFDD00]/30 shadow-inner overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Coffee className="h-24 w-24 rotate-12" />
            </div>
            <p className="text-sm font-black text-[#6F4E37]/70 dark:text-muted-foreground uppercase tracking-[0.2em] mb-2">총 응원 금액</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl font-black text-[#6F4E37] dark:text-[#FFDD00]">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* Supporter Info */}
          <div className="space-y-8">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="supporterName" className="text-sm font-black text-muted-foreground uppercase tracking-widest">이름 (선택)</Label>
                <Input
                  id="supporterName"
                  placeholder="보여질 닉네임"
                  className="h-14 rounded-2xl border-2 focus:border-[#FFDD00] transition-all font-bold text-base bg-muted/30"
                  {...form.register('supporterName')}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="supporterEmail" className="text-sm font-black text-muted-foreground uppercase tracking-widest">이메일 (선택)</Label>
                <Input
                  id="supporterEmail"
                  type="email"
                  placeholder="영수증 수령 이메일"
                  className="h-14 rounded-2xl border-2 focus:border-[#FFDD00] transition-all font-bold text-base bg-muted/30"
                  {...form.register('supporterEmail')}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="message" className="text-sm font-black text-muted-foreground uppercase tracking-widest">응원 메시지 (선택)</Label>
              <div className="relative">
                <Textarea
                  id="message"
                  placeholder="따뜻한 응원 한마디가 크리에이터에게 큰 힘이 됩니다!"
                  className="rounded-3xl border-2 focus:border-[#FFDD00] transition-all font-medium text-lg min-h-[140px] resize-none p-6 bg-muted/30"
                  maxLength={MAX_MESSAGE_LENGTH}
                  {...form.register('message')}
                />
                <div className="absolute bottom-4 right-6 text-xs font-bold text-muted-foreground/60">
                  {form.watch('message')?.length || 0} / {MAX_MESSAGE_LENGTH}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-muted/20 border-2 border-dashed border-muted-foreground/10 transition-colors hover:border-[#FFDD00]/30 group">
              <Checkbox
                id="isAnonymous"
                checked={form.watch('isAnonymous')}
                onCheckedChange={(checked: boolean) => form.setValue('isAnonymous', checked)}
                className="h-6 w-6 rounded-lg data-[state=checked]:bg-[#FFDD00] data-[state=checked]:text-black border-2 border-[#FFDD00]"
              />
              <Label htmlFor="isAnonymous" className="text-base font-bold text-muted-foreground cursor-pointer group-hover:text-[#6F4E37] transition-colors">
                익명으로 조용히 응원하기
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-20 text-2xl font-black rounded-[1.5rem] transition-all duration-300 bg-[#FFDD00] text-black hover:bg-[#E5C700] shadow-[0_15px_35px_rgba(255,221,0,0.35)] hover:shadow-[0_20px_45px_rgba(255,221,0,0.45)] hover:-translate-y-1 active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-3 h-8 w-8 animate-spin" />
            ) : (
              <Coffee className="mr-3 h-8 w-8 fill-black/10" />
            )}
            {totalAmount.toLocaleString()}원 후원하기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
