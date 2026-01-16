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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">계정 설정</h1>
        <p className="text-muted-foreground font-medium">나만의 브랜드와 정산 정보를 관리하세요.</p>
      </div>

      <div className="grid gap-6">
        {/* Username Section */}
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">사용자명 및 주소</CardTitle>
            <CardDescription>
              후원자들이 방문할 나만의 고유한 주소를 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <Label className="text-sm font-semibold">페이지 주소</Label>
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mb-1">
                  {APP_URL}/@
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">@</span>
                  <Input
                    className="pl-8 h-12 rounded-xl border focus:ring-1 focus:ring-[#FFDD00]"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  />
                </div>
              </div>
              <Button
                onClick={saveUsername}
                disabled={usernameStatus !== 'available' || isSavingUsername}
                className="h-12 px-8 rounded-xl font-bold bg-[#FFDD00] text-black hover:bg-[#E5C700]"
              >
                {isSavingUsername ? <Loader2 className="h-5 w-5 animate-spin" /> : '변경'}
              </Button>
            </div>
            <div className="min-h-[20px]">
              {usernameStatus === 'checking' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>중복 확인 중...</span>
                </div>
              )}
              {usernameStatus === 'available' && (
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <Check className="h-4 w-4" />
                  <span>사용 가능합니다.</span>
                </div>
              )}
              {usernameStatus === 'taken' && (
                <div className="flex items-center gap-2 text-sm text-destructive font-medium">
                  <X className="h-4 w-4" />
                  <span>이미 사용 중인 이름입니다.</span>
                </div>
              )}
              {usernameStatus === 'invalid' && (
                <div className="flex items-center gap-2 text-sm text-destructive font-medium">
                  <X className="h-4 w-4" />
                  <span>영문 소문자, 숫자, 밑줄만 가능 (3-20자)</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">프로필 정보</CardTitle>
              <CardDescription>내 후원 페이지에 보여질 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">표시 이름</Label>
                  <Input 
                    id="name" 
                    placeholder="홍길동" 
                    className="h-12 rounded-xl border" 
                    {...form.register('name')} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coffeePrice" className="text-sm font-semibold">커피 1잔 가격 (원)</Label>
                  <Input
                    id="coffeePrice"
                    type="number"
                    placeholder="3000"
                    className="h-12 rounded-xl border font-bold"
                    {...form.register('coffeePrice', { valueAsNumber: true })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-semibold">소개 한마디</Label>
                <Textarea
                  id="bio"
                  placeholder="후원자들에게 나를 소개해보세요."
                  className="rounded-xl p-4 min-h-[120px] resize-none border"
                  {...form.register('bio')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="themeColor" className="text-sm font-semibold">브랜드 색상</Label>
                <div className="flex gap-4">
                  <Input
                    id="themeColor"
                    type="color"
                    className="h-12 w-20 cursor-pointer p-1 rounded-xl"
                    {...form.register('themeColor')}
                  />
                  <Input
                    placeholder="#FFDD00"
                    {...form.register('themeColor')}
                    className="flex-1 h-12 rounded-xl font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="rounded-xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">소셜 링크</CardTitle>
              <CardDescription>외부 링크를 통해 팬들이 당신을 더 알 수 있게 하세요.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {[
                { id: 'github', label: 'GitHub 주소', placeholder: 'https://github.com/...' },
                { id: 'blog', label: '블로그 / 뉴스레터', placeholder: 'https://...' },
                { id: 'twitter', label: 'Twitter (X) 주소', placeholder: 'https://twitter.com/...' },
                { id: 'instagram', label: 'Instagram 주소', placeholder: 'https://instagram.com/...' },
              ].map((link) => (
                <div key={link.id} className="space-y-2">
                  <Label className="text-sm font-semibold">{link.label}</Label>
                  <Input 
                    placeholder={link.placeholder} 
                    className="h-11 rounded-xl border"
                    {...form.register(`socialLinks.${link.id}` as any)} 
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bank Account */}
          <Card className="rounded-xl border shadow-sm border-amber-200 bg-amber-50/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <CardTitle className="text-xl font-bold">정산 계좌 정보</CardTitle>
              </div>
              <CardDescription>
                매주 금요일에 정산된 금액이 입금됩니다. 실명 계좌를 입력해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">은행</Label>
                <Select
                  value={form.watch('bankCode') || ''}
                  onValueChange={(value) => form.setValue('bankCode', value)}
                >
                  <SelectTrigger className="h-12 rounded-xl border">
                    <SelectValue placeholder="은행 선택" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {BANK_OPTIONS.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value}>
                        {bank.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label className="text-sm font-semibold">계좌번호</Label>
                <Input 
                  placeholder="'-' 제외 숫자만" 
                  className="h-12 rounded-xl border font-bold"
                  {...form.register('bankAccount')} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">예금주</Label>
                <Input 
                  placeholder="실명" 
                  className="h-12 rounded-xl border"
                  {...form.register('bankHolder')} 
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSaving}
              className="h-14 px-12 rounded-xl text-lg font-bold bg-[#FFDD00] text-black hover:bg-[#E5C700] shadow-sm"
            >
              {isSaving && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              설정 저장하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

