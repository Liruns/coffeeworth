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
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">계정 설정</h1>
        <p className="text-lg text-muted-foreground font-medium">내 프로필과 정산 정보를 관리하세요.</p>
      </div>

      <div className="grid gap-8">
        {/* Username Section */}
        <Card className="rounded-xl border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-xl">사용자명 및 주소</CardTitle>
            <CardDescription className="text-sm font-medium">
              내 후원 페이지의 고유 주소를 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">페이지 주소</Label>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                  {APP_URL}/@
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">@</span>
                  <Input
                    className="pl-8 h-12 text-lg font-semibold rounded-xl border-2 focus:border-[#FFDD00] transition-all"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  />
                </div>
              </div>
              <Button
                onClick={saveUsername}
                disabled={usernameStatus !== 'available' || isSavingUsername}
                className="h-12 px-8 rounded-xl font-bold bg-[#FFDD00] text-black hover:bg-[#E5C700] shadow-md transition-all"
              >
                {isSavingUsername ? <Loader2 className="h-5 w-5 animate-spin" /> : '사용자명 변경'}
              </Button>
            </div>
            <div className="flex items-center gap-2 min-h-[20px]">
              {usernameStatus === 'checking' && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#6F4E37]" />
                  <span className="text-sm font-medium text-muted-foreground">중복 확인 중...</span>
                </>
              )}
              {usernameStatus === 'available' && (
                <>
                  <Check className="h-4 w-4 text-green-500 font-bold" />
                  <span className="text-sm font-bold text-green-500">멋진 이름이네요! 사용 가능한 사용자명입니다.</span>
                </>
              )}
              {usernameStatus === 'taken' && (
                <>
                  <X className="h-4 w-4 text-destructive font-bold" />
                  <span className="text-sm font-bold text-destructive">아쉽게도 이미 사용 중인 이름입니다.</span>
                </>
              )}
              {usernameStatus === 'invalid' && (
                <>
                  <X className="h-4 w-4 text-destructive font-bold" />
                  <span className="text-sm font-bold text-destructive">영문 소문자, 숫자, 밑줄만 가능해요 (3-20자)</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="rounded-xl border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-xl">프로필 정보</CardTitle>
              <CardDescription className="text-sm font-medium">후원자들에게 보여지는 내 정보를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-muted-foreground uppercase tracking-wider">표시 이름</Label>
                  <Input 
                    id="name" 
                    placeholder="홍길동" 
                    className="h-11 rounded-lg border-muted-foreground/20" 
                    {...form.register('name')} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coffeePrice" className="text-sm font-bold text-muted-foreground uppercase tracking-wider">커피 1잔 가격 (원)</Label>
                  <Input
                    id="coffeePrice"
                    type="number"
                    placeholder="3000"
                    className="h-11 rounded-lg border-muted-foreground/20"
                    {...form.register('coffeePrice', { valueAsNumber: true })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-bold text-muted-foreground uppercase tracking-wider">자기소개</Label>
                <Textarea
                  id="bio"
                  placeholder="후원자들에게 나를 소개해보세요 (예: 따뜻한 커피 한 잔으로 오픈소스 개발을 응원해주세요!)"
                  className="rounded-lg min-h-[120px] resize-none border-muted-foreground/20 p-4"
                  {...form.register('bio')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="themeColor" className="text-sm font-bold text-muted-foreground uppercase tracking-wider">브랜드 색상</Label>
                <div className="flex gap-4">
                  <div className="relative group cursor-pointer">
                    <Input
                      id="themeColor"
                      type="color"
                      className="h-12 w-24 p-1 cursor-pointer rounded-lg border-2 border-muted"
                      {...form.register('themeColor')}
                    />
                  </div>
                  <Input
                    placeholder="#FFDD00"
                    {...form.register('themeColor')}
                    className="flex-1 h-12 font-mono uppercase rounded-lg border-muted-foreground/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="rounded-xl border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-xl">소셜 미디어</CardTitle>
              <CardDescription className="text-sm font-medium">연결하고 싶은 SNS 주소를 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">GitHub</Label>
                <Input 
                  placeholder="https://github.com/..." 
                  className="h-11 rounded-lg border-muted-foreground/20"
                  {...form.register('socialLinks.github')} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">블로그 / 웹사이트</Label>
                <Input 
                  placeholder="https://..." 
                  className="h-11 rounded-lg border-muted-foreground/20"
                  {...form.register('socialLinks.blog')} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Twitter (X)</Label>
                <Input 
                  placeholder="https://twitter.com/..." 
                  className="h-11 rounded-lg border-muted-foreground/20"
                  {...form.register('socialLinks.twitter')} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Instagram</Label>
                <Input 
                  placeholder="https://instagram.com/..." 
                  className="h-11 rounded-lg border-muted-foreground/20"
                  {...form.register('socialLinks.instagram')} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Bank Account */}
          <Card className="rounded-xl border shadow-sm overflow-hidden border-l-4 border-l-[#FFDD00]">
            <CardHeader className="bg-[#FFF8E7] dark:bg-muted/40 border-b">
              <CardTitle className="text-xl">정산 계좌 정보</CardTitle>
              <CardDescription className="text-sm font-medium text-[#6F4E37] dark:text-muted-foreground">
                매주 금요일에 수익금이 정산됩니다. 정확한 정보를 입력해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3 pt-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">은행</Label>
                <Select
                  value={form.watch('bankCode') || ''}
                  onValueChange={(value) => form.setValue('bankCode', value)}
                >
                  <SelectTrigger className="h-11 rounded-lg border-muted-foreground/20">
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
              <div className="space-y-2 md:col-span-1">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">계좌번호</Label>
                <Input 
                  placeholder="'-' 제외 숫자만 입력" 
                  className="h-11 rounded-lg border-muted-foreground/20"
                  {...form.register('bankAccount')} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">예금주</Label>
                <Input 
                  placeholder="예금주 성함" 
                  className="h-11 rounded-lg border-muted-foreground/20"
                  {...form.register('bankHolder')} 
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSaving}
              className="h-14 px-12 rounded-xl text-lg font-bold bg-[#FFDD00] text-black hover:bg-[#E5C700] shadow-lg hover:shadow-xl transition-all"
            >
              {isSaving ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
              모든 설정 저장하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
