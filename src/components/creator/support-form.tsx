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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{DEFAULT_COFFEE_EMOJI}</span>
          <span>{creatorName}님에게 커피 사주기</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Coffee Count Selection */}
          <div className="space-y-3">
            <Label>커피 수량</Label>
            <div className="flex flex-wrap gap-2">
              {COFFEE_PRESETS.map((count) => (
                <Button
                  key={count}
                  type="button"
                  variant={coffeeCount === count && !customCount ? 'default' : 'outline'}
                  className={cn(
                    'flex-1 min-w-[80px]',
                    coffeeCount === count && !customCount && 'ring-2 ring-offset-2'
                  )}
                  style={
                    coffeeCount === count && !customCount
                      ? { backgroundColor: themeColor, borderColor: themeColor }
                      : undefined
                  }
                  onClick={() => handleCoffeeSelect(count)}
                >
                  {DEFAULT_COFFEE_EMOJI} x {count}
                </Button>
              ))}
              <div className="flex-1 min-w-[80px]">
                <Input
                  type="number"
                  placeholder="직접 입력"
                  min={1}
                  max={100}
                  value={customCount}
                  onChange={(e) => handleCustomCount(e.target.value)}
                  className={cn(
                    customCount && 'ring-2 ring-offset-2'
                  )}
                  style={customCount ? { borderColor: themeColor } : undefined}
                />
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">총 후원 금액</p>
            <p className="text-2xl font-bold" style={{ color: themeColor }}>
              {totalAmount.toLocaleString()}원
            </p>
          </div>

          {/* Supporter Info */}
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supporterName">이름 (선택)</Label>
                <Input
                  id="supporterName"
                  placeholder="표시될 이름"
                  {...form.register('supporterName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supporterEmail">이메일 (선택)</Label>
                <Input
                  id="supporterEmail"
                  type="email"
                  placeholder="영수증을 받을 이메일"
                  {...form.register('supporterEmail')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">응원 메시지 (선택)</Label>
              <Textarea
                id="message"
                placeholder="따뜻한 응원 한마디를 남겨주세요!"
                rows={3}
                maxLength={MAX_MESSAGE_LENGTH}
                {...form.register('message')}
              />
              <p className="text-xs text-muted-foreground text-right">
                {form.watch('message')?.length || 0} / {MAX_MESSAGE_LENGTH}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAnonymous"
                checked={form.watch('isAnonymous')}
                onCheckedChange={(checked: boolean) => form.setValue('isAnonymous', checked)}
              />
              <Label htmlFor="isAnonymous" className="text-sm font-normal">
                익명으로 후원하기
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={isLoading}
            style={{ backgroundColor: themeColor }}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Coffee className="mr-2 h-5 w-5" />
            )}
            {totalAmount.toLocaleString()}원 후원하기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
