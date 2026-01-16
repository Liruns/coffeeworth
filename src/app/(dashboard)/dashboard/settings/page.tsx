'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Check, X, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateProfileSchema, updateUsernameSchema, type UpdateProfileInput } from '@/lib/validations/profile';
import { BANK_OPTIONS } from '@/constants/bank-codes';
import { DEFAULT_COFFEE_PRICE, APP_URL } from '@/constants';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  image: string | null;
  bio: string | null;
  coffeePrice: number;
  themeColor: string;
  socialLinks: Record<string, string> | null;
  bankCode: string | null;
  bankAccount: string | null;
  bankHolder: string | null;
  emailNotify: boolean;
  isVerified: boolean;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Username state
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      bio: '',
      coffeePrice: DEFAULT_COFFEE_PRICE,
      themeColor: '#FFDD00',
      socialLinks: {},
      bankCode: '',
      bankAccount: '',
      bankHolder: '',
      emailNotify: true,
    },
  });

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
          setUsername(data.data.username || '');
          form.reset({
            name: data.data.name || '',
            bio: data.data.bio || '',
            coffeePrice: data.data.coffeePrice,
            themeColor: data.data.themeColor,
            socialLinks: data.data.socialLinks || {},
            bankCode: data.data.bankCode || '',
            bankAccount: data.data.bankAccount || '',
            bankHolder: data.data.bankHolder || '',
            emailNotify: data.data.emailNotify,
          });
        }
      } catch {
        toast.error('프로필을 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [form]);

  // Username validation
  useEffect(() => {
    if (!username || username === profile?.username) {
      setUsernameStatus('idle');
      return;
    }

    const result = updateUsernameSchema.safeParse({ username });
    if (!result.success) {
      setUsernameStatus('invalid');
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus('checking');
      try {
        const res = await fetch(`/api/me/username?username=${username}`);
        const data = await res.json();
        setUsernameStatus(data.data?.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, profile?.username]);

  // Save profile
  const onSubmit = async (data: UpdateProfileInput) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setProfile(result.data);
        toast.success('프로필이 저장되었습니다');
      } else {
        toast.error(result.error?.message || '저장에 실패했습니다');
      }
    } catch {
      toast.error('저장 중 오류가 발생했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  // Save username
  const saveUsername = async () => {
    if (usernameStatus !== 'available') return;
    
    setIsSavingUsername(true);
    try {
      const res = await fetch('/api/me/username', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const result = await res.json();
      if (result.success) {
        setProfile((prev) => prev ? { ...prev, username } : null);
        setUsernameStatus('idle');
        toast.success('사용자명이 변경되었습니다');
      } else {
        toast.error(result.error?.message || '변경에 실패했습니다');
      }
    } catch {
      toast.error('변경 중 오류가 발생했습니다');
    } finally {
      setIsSavingUsername(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight">계정 설정</h1>
        <p className="text-xl text-muted-foreground font-medium">나만의 브랜드와 정산 정보를 관리하세요.</p>
      </div>

      <div className="grid gap-10">
        {/* Username Section */}
        <Card className="rounded-[2rem] border-2 border-white dark:border-zinc-800 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80 transition-all hover:shadow-2xl">
          <CardHeader className="bg-[#FFDD00]/5 border-b p-8">
            <CardTitle className="text-2xl font-black">사용자명 및 주소</CardTitle>
            <CardDescription className="text-base font-bold text-[#6F4E37]/70 dark:text-muted-foreground">
              후원자들이 방문할 나만의 고유한 주소를 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end">
              <div className="flex-1 space-y-3">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">페이지 주소</Label>
                <div className="flex items-center gap-2 text-sm font-bold text-[#6F4E37] mb-2 px-3 py-1 bg-[#FFF8E7] rounded-lg w-fit">
                  {APP_URL}/@
                </div>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground group-focus-within:text-[#FFDD00] transition-colors">@</span>
                  <Input
                    className="pl-12 h-16 text-xl font-black rounded-2xl border-2 focus:border-[#FFDD00] focus:ring-4 focus:ring-[#FFDD00]/10 transition-all bg-muted/20"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  />
                </div>
              </div>
              <Button
                onClick={saveUsername}
                disabled={usernameStatus !== 'available' || isSavingUsername}
                className="h-16 px-10 rounded-2xl font-black text-lg bg-[#FFDD00] text-black hover:bg-[#E5C700] shadow-[0_8px_20px_rgba(255,221,0,0.3)] transition-all active:scale-95 disabled:opacity-50"
              >
                {isSavingUsername ? <Loader2 className="h-6 w-6 animate-spin" /> : '사용자명 변경'}
              </Button>
            </div>
            <div className="flex items-center gap-3 min-h-[24px]">
              {usernameStatus === 'checking' && (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-[#6F4E37]" />
                  <span className="text-base font-bold text-muted-foreground">중복 확인 중...</span>
                </>
              )}
              {usernameStatus === 'available' && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-left-2">
                  <Check className="h-5 w-5 font-black" />
                  <span className="text-base font-black uppercase tracking-tight">멋진 이름이네요! 사용 가능합니다.</span>
                </div>
              )}
              {usernameStatus === 'taken' && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/5 text-destructive border border-destructive/10">
                  <X className="h-5 w-5 font-black" />
                  <span className="text-base font-black">이미 사용 중인 이름입니다.</span>
                </div>
              )}
              {usernameStatus === 'invalid' && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/5 text-destructive border border-destructive/10">
                  <X className="h-5 w-5 font-black" />
                  <span className="text-base font-black tracking-tight">영문 소문자, 숫자, 밑줄만 가능 (3-20자)</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <Card className="rounded-[2rem] border-2 border-white dark:border-zinc-800 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80 transition-all hover:shadow-2xl">
            <CardHeader className="bg-[#FFDD00]/5 border-b p-8">
              <CardTitle className="text-2xl font-black">프로필 정보</CardTitle>
              <CardDescription className="text-base font-bold text-[#6F4E37]/70 dark:text-muted-foreground">내 후원 페이지를 방문하는 팬들에게 보여질 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">표시 이름</Label>
                  <Input 
                    id="name" 
                    placeholder="홍길동" 
                    className="h-14 rounded-2xl border-2 focus:border-[#FFDD00] transition-all bg-muted/20 text-lg font-bold" 
                    {...form.register('name')} 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="coffeePrice" className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">커피 1잔 가격 (원)</Label>
                  <div className="relative group">
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-muted-foreground group-focus-within:text-[#6F4E37]">원</span>
                    <Input
                      id="coffeePrice"
                      type="number"
                      placeholder="3000"
                      className="h-14 rounded-2xl border-2 focus:border-[#FFDD00] transition-all bg-muted/20 text-lg font-black"
                      {...form.register('coffeePrice', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="bio" className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">나의 소개 한마디</Label>
                <Textarea
                  id="bio"
                  placeholder="후원자들에게 나를 멋지게 소개해보세요! (예: 따뜻한 커피 한 잔으로 지속 가능한 오픈소스 생태계를 응원해주세요!)"
                  className="rounded-3xl border-2 focus:border-[#FFDD00] transition-all bg-muted/20 p-6 min-h-[160px] resize-none text-lg font-medium leading-relaxed"
                  {...form.register('bio')}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="themeColor" className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">브랜드 포인트 색상</Label>
                <div className="flex gap-4">
                  <div className="relative h-14 w-28 overflow-hidden rounded-2xl border-2 border-muted shadow-inner group">
                    <Input
                      id="themeColor"
                      type="color"
                      className="absolute inset-0 h-full w-full scale-150 cursor-pointer p-0 border-none"
                      {...form.register('themeColor')}
                    />
                  </div>
                  <Input
                    placeholder="#FFDD00"
                    {...form.register('themeColor')}
                    className="flex-1 h-14 font-mono uppercase rounded-2xl border-2 focus:border-[#FFDD00] bg-muted/20 text-lg font-bold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="rounded-[2rem] border-2 border-white dark:border-zinc-800 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80 transition-all hover:shadow-2xl">
            <CardHeader className="bg-[#FFDD00]/5 border-b p-8">
              <CardTitle className="text-2xl font-black">소셜 미디어 연결</CardTitle>
              <CardDescription className="text-base font-bold text-[#6F4E37]/70 dark:text-muted-foreground">외부 링크를 통해 팬들이 당신을 더 자세히 알 수 있게 하세요.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-2 p-8">
              {[
                { id: 'github', label: 'GitHub 주소', placeholder: 'https://github.com/...' },
                { id: 'blog', label: '블로그 / 뉴스레터', placeholder: 'https://...' },
                { id: 'twitter', label: 'Twitter (X) 주소', placeholder: 'https://twitter.com/...' },
                { id: 'instagram', label: 'Instagram 주소', placeholder: 'https://instagram.com/...' },
              ].map((link) => (
                <div key={link.id} className="space-y-3">
                  <Label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{link.label}</Label>
                  <Input 
                    placeholder={link.placeholder} 
                    className="h-14 rounded-2xl border-2 focus:border-[#FFDD00] transition-all bg-muted/20 font-medium"
                    {...form.register(`socialLinks.${link.id}` as any)} 
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bank Account */}
          <Card className="rounded-[2rem] border-4 border-[#FFDD00] shadow-2xl overflow-hidden bg-white backdrop-blur-xl dark:bg-zinc-900 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardHeader className="bg-[#FFF8E7] dark:bg-muted/40 border-b p-8">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="h-6 w-6 text-[#6F4E37]" />
                <CardTitle className="text-2xl font-black">수익금 정산 계좌</CardTitle>
              </div>
              <CardDescription className="text-base font-bold text-[#6F4E37]">
                매주 금요일에 정산된 금액이 입금됩니다. 실명 확인이 된 계좌를 입력해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-3 p-8">
              <div className="space-y-3">
                <Label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">은행</Label>
                <Select
                  value={form.watch('bankCode') || ''}
                  onValueChange={(value) => form.setValue('bankCode', value)}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-2 border-[#FFDD00]/30 focus:border-[#FFDD00] transition-all bg-muted/20 font-bold">
                    <SelectValue placeholder="은행 선택" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-2xl border-2">
                    {BANK_OPTIONS.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value} className="rounded-xl my-1 font-bold">
                        {bank.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 md:col-span-1">
                <Label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">계좌번호</Label>
                <Input 
                  placeholder="'-' 제외 숫자만 입력" 
                  className="h-14 rounded-2xl border-2 border-[#FFDD00]/30 focus:border-[#FFDD00] transition-all bg-muted/20 text-lg font-black"
                  {...form.register('bankAccount')} 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">예금주 실명</Label>
                <Input 
                  placeholder="예금주 성함" 
                  className="h-14 rounded-2xl border-2 border-[#FFDD00]/30 focus:border-[#FFDD00] transition-all bg-muted/20 text-lg font-black"
                  {...form.register('bankHolder')} 
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center md:justify-end pt-6">
            <Button 
              type="submit" 
              disabled={isSaving}
              className="h-20 px-20 rounded-[1.5rem] text-2xl font-black bg-[#FFDD00] text-black hover:bg-[#E5C700] shadow-[0_20px_50px_rgba(255,221,0,0.4)] transition-all hover:-translate-y-2 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="mr-3 h-8 w-8 animate-spin" /> : null}
              모든 설정 저장하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

