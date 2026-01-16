'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Check, X } from 'lucide-react';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">설정</h1>
        <p className="text-muted-foreground">프로필과 계정을 관리하세요.</p>
      </div>

      {/* Username Section */}
      <Card>
        <CardHeader>
          <CardTitle>사용자명</CardTitle>
          <CardDescription>
            후원 페이지 주소로 사용됩니다. {APP_URL}/@사용자명
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input
                className="pl-7"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
              />
            </div>
            <Button
              onClick={saveUsername}
              disabled={usernameStatus !== 'available' || isSavingUsername}
            >
              {isSavingUsername ? <Loader2 className="h-4 w-4 animate-spin" /> : '저장'}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {usernameStatus === 'checking' && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground">확인 중...</span>
              </>
            )}
            {usernameStatus === 'available' && (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-green-500">사용 가능한 사용자명입니다</span>
              </>
            )}
            {usernameStatus === 'taken' && (
              <>
                <X className="h-4 w-4 text-destructive" />
                <span className="text-destructive">이미 사용 중인 사용자명입니다</span>
              </>
            )}
            {usernameStatus === 'invalid' && (
              <>
                <X className="h-4 w-4 text-destructive" />
                <span className="text-destructive">영문 소문자, 숫자, 밑줄만 사용 (3-20자)</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
            <CardDescription>후원 페이지에 표시되는 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" placeholder="홍길동" {...form.register('name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coffeePrice">커피 가격 (원)</Label>
                <Input
                  id="coffeePrice"
                  type="number"
                  placeholder="3000"
                  {...form.register('coffeePrice', { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">자기소개</Label>
              <Textarea
                id="bio"
                placeholder="간단한 자기소개를 작성해주세요."
                rows={3}
                {...form.register('bio')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="themeColor">테마 색상</Label>
              <div className="flex gap-2">
                <Input
                  id="themeColor"
                  type="color"
                  className="h-10 w-20 p-1"
                  {...form.register('themeColor')}
                />
                <Input
                  placeholder="#FFDD00"
                  {...form.register('themeColor')}
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>소셜 링크</CardTitle>
            <CardDescription>프로필에 표시할 소셜 링크를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input placeholder="https://github.com/username" {...form.register('socialLinks.github')} />
              </div>
              <div className="space-y-2">
                <Label>블로그</Label>
                <Input placeholder="https://blog.example.com" {...form.register('socialLinks.blog')} />
              </div>
              <div className="space-y-2">
                <Label>Twitter</Label>
                <Input placeholder="https://twitter.com/username" {...form.register('socialLinks.twitter')} />
              </div>
              <div className="space-y-2">
                <Label>웹사이트</Label>
                <Input placeholder="https://example.com" {...form.register('socialLinks.website')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Bank Account */}
        <Card>
          <CardHeader>
            <CardTitle>정산 계좌</CardTitle>
            <CardDescription>후원금을 받을 계좌 정보를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>은행</Label>
                <Select
                  value={form.watch('bankCode') || ''}
                  onValueChange={(value) => form.setValue('bankCode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="은행 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {BANK_OPTIONS.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value}>
                        {bank.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>계좌번호</Label>
                <Input placeholder="계좌번호 (- 없이)" {...form.register('bankAccount')} />
              </div>
              <div className="space-y-2">
                <Label>예금주</Label>
                <Input placeholder="예금주명" {...form.register('bankHolder')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            저장하기
          </Button>
        </div>
      </form>
    </div>
  );
}
