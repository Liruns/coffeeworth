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
        toast.success('후원 준비가 완료되었습니다. 결제를 진행해주세요.');
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
    <Card className="rounded-2xl border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/50 border-b py-6">
        <CardTitle className="text-xl font-bold text-center">
          {creatorName}님에게 커피 선물하기
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Coffee Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold">커피 수량</Label>
            <div className="grid grid-cols-4 gap-2">
              {COFFEE_PRESETS.map((count) => (
                <Button
                  key={count}
                  type="button"
                  variant={coffeeCount === count && !customCount ? 'default' : 'outline'}
                  className={cn(
                    'h-12 text-lg font-bold rounded-xl border',
                    coffeeCount === count && !customCount && 'bg-[#FFDD00] text-black border-[#FFDD00] hover:bg-[#E5C700]'
                  )}
                  onClick={() => handleCoffeeSelect(count)}
                >
                  {DEFAULT_COFFEE_EMOJI} {count}
                </Button>
              ))}
              <Input
                type="number"
                placeholder="직접"
                min={1}
                max={100}
                value={customCount}
                onChange={(e) => handleCustomCount(e.target.value)}
                className={cn(
                  'h-12 text-center text-lg font-bold rounded-xl border',
                  customCount && 'border-[#FFDD00] ring-1 ring-[#FFDD00]'
                )}
              />
            </div>
          </div>

          {/* Amount Display */}
          <div className="bg-muted/30 rounded-xl p-6 text-center border">
            <p className="text-sm text-muted-foreground mb-1">총 후원 금액</p>
            <p className="text-3xl font-bold">
              {totalAmount.toLocaleString()}원
            </p>
          </div>

          {/* Info Fields */}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supporterName" className="text-sm font-semibold">이름 (선택)</Label>
                <Input
                  id="supporterName"
                  placeholder="보여질 닉네임"
                  className="rounded-xl h-11"
                  {...form.register('supporterName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supporterEmail" className="text-sm font-semibold">이메일 (선택)</Label>
                <Input
                  id="supporterEmail"
                  type="email"
                  placeholder="영수증 수령용"
                  className="rounded-xl h-11"
                  {...form.register('supporterEmail')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-semibold">응원 메시지 (선택)</Label>
              <div className="relative">
                <Textarea
                  id="message"
                  placeholder="따뜻한 응원 한마디를 남겨주세요."
                  className="rounded-xl min-h-[100px] resize-none"
                  maxLength={MAX_MESSAGE_LENGTH}
                  {...form.register('message')}
                />
                <div className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">
                  {form.watch('message')?.length || 0} / {MAX_MESSAGE_LENGTH}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 py-1">
              <Checkbox
                id="isAnonymous"
                checked={form.watch('isAnonymous')}
                onCheckedChange={(checked: boolean) => form.setValue('isAnonymous', checked)}
              />
              <Label htmlFor="isAnonymous" className="text-sm font-medium cursor-pointer">
                익명으로 후원하기
              </Label>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-14 text-lg font-bold rounded-xl bg-[#FFDD00] text-black hover:bg-[#E5C700] shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Coffee className="mr-2 h-5 w-5" />
            )}
            {totalAmount.toLocaleString()}원 응원하기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
